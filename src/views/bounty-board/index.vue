<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import PlayerStatusBar from './components/PlayerStatusBar.vue'
import BountyCard from './components/BountyCard.vue'
import ActiveQuestCard from './components/ActiveQuestCard.vue'
import ShopModal from './components/ShopModal.vue'
import { useGameState } from './composables/useGameState'
import { SHOP_ITEMS, REFRESH_COST } from './constants'

const {
  player,
  boardQuests,
  activeQuests,
  notifications,
  refreshBoard,
  acceptQuest,
  randomAccept,
  completeQuest,
  skipQuest,
  buyItem,
  resetPlayer,
  expProgress,
  hpPercent,
} = useGameState()

type Tab = 'board' | 'shop'
const activeTab = ref<Tab>('board')

function handleRefreshBoard() {
  refreshBoard()
}

function handleRandomAccept() {
  randomAccept()
}

function handleAccept(uid: string) {
  acceptQuest(uid)
}

function handleComplete(uid: string) {
  completeQuest(uid)
}

function handleSkip(uid: string) {
  skipQuest(uid)
}

function handleBuy(itemId: string) {
  buyItem(itemId)
}

function handleReset() {
  resetPlayer()
}

function switchTab(tab: Tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="min-h-screen bg-bg-deep text-text-primary font-body">
    <!-- Player Status Bar (fixed top) -->
    <PlayerStatusBar :player="player" :exp-progress="expProgress" :hp-percent="hpPercent" />

    <!-- Notifications -->
    <div class="fixed top-[60px] right-4 z-50 flex flex-col gap-2 w-72 pointer-events-none">
      <TransitionGroup name="notif">
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="border px-4 py-2.5 font-display text-xs tracking-wide shadow-lg pointer-events-auto"
          :class="{
            'border-accent-coral bg-accent-coral/10 text-accent-coral': notif.type === 'fail',
            'border-accent-amber bg-accent-amber/10 text-accent-amber':
              notif.type === 'warning' || notif.type === 'levelup',
            'border-green-500 bg-green-500/10 text-green-400': notif.type === 'success',
            'border-red-500 bg-red-500/10 text-red-400': notif.type === 'boss',
          }"
        >
          {{ notif.message }}
        </div>
      </TransitionGroup>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-5xl px-4 pt-20 pb-16">
      <!-- ── Page Header ── -->
      <header class="mb-8 text-center animate-fade-up">
        <!-- Board sign decoration -->
        <div class="relative inline-block mb-4">
          <div
            class="border-2 border-accent-amber bg-bg-surface px-8 py-4 shadow-lg shadow-accent-amber/10"
          >
            <div class="flex items-center gap-3 justify-center mb-1">
              <span class="flex gap-0.5">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="block w-1 h-4 odd:bg-accent-amber/40 even:bg-bg-elevated"
                />
              </span>
              <span class="font-display text-[10px] tracking-[0.3em] text-accent-amber/60 uppercase"
                >Hệ thống người chơi</span
              >
              <span class="flex gap-0.5">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="block w-1 h-4 odd:bg-accent-amber/40 even:bg-bg-elevated"
                />
              </span>
            </div>
            <h1
              class="font-display text-3xl sm:text-5xl font-bold text-accent-amber tracking-widest"
            >
              BẢNG NHIỆM VỤ
            </h1>
            <div class="flex items-center justify-center gap-2 mt-1">
              <div class="h-px flex-1 bg-accent-amber/30" />
              <span class="font-display text-[10px] tracking-[0.2em] text-text-dim"
                >QUEST BOARD</span
              >
              <div class="h-px flex-1 bg-accent-amber/30" />
            </div>
          </div>
          <!-- Corner screws -->
          <div class="absolute top-1.5 left-1.5 size-2 rounded-full bg-accent-amber/40" />
          <div class="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent-amber/40" />
          <div class="absolute bottom-1.5 left-1.5 size-2 rounded-full bg-accent-amber/40" />
          <div class="absolute bottom-1.5 right-1.5 size-2 rounded-full bg-accent-amber/40" />
        </div>

        <p class="text-text-secondary text-sm animate-fade-up animate-delay-2">
          Hoàn thành nhiệm vụ thực tế mỗi ngày để nhận thưởng EXP và Vàng.
          <br class="hidden sm:block" />
          Mỗi lần <span class="text-accent-amber font-semibold">thăng cấp</span>, một Boss sẽ xuất
          hiện — đánh bại để nhận thưởng lớn!
        </p>
      </header>

      <!-- ── Tabs ── -->
      <div class="mb-6 flex border-b border-border-default animate-fade-up animate-delay-3">
        <button
          v-for="tab in ['board', 'shop'] as Tab[]"
          :key="tab"
          class="flex items-center gap-2 border-b-2 px-6 py-3 font-display text-sm tracking-wide transition-colors"
          :class="
            activeTab === tab
              ? 'border-accent-coral text-accent-coral'
              : 'border-transparent text-text-dim hover:text-text-secondary'
          "
          @click="switchTab(tab)"
        >
          <Icon :icon="tab === 'board' ? 'lucide:scroll' : 'lucide:store'" class="size-4" />
          {{ tab === 'board' ? 'Bảng Nhiệm Vụ' : 'Cửa Hàng' }}
        </button>
      </div>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- TAB: BOARD -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'board'" class="space-y-8">
        <!-- ── Active Quests ── -->
        <section v-if="activeQuests.length > 0" class="animate-fade-up">
          <h2 class="mb-4 flex items-center gap-3 font-display text-lg font-semibold">
            <span class="text-accent-coral text-sm tracking-widest">//</span>
            Đang Thực Hiện
            <span
              class="border border-accent-coral/40 bg-accent-coral/10 px-2 py-0.5 font-display text-xs text-accent-coral"
            >
              {{ activeQuests.length }}
            </span>
          </h2>
          <div class="space-y-3">
            <ActiveQuestCard
              v-for="quest in activeQuests"
              :key="quest.uid"
              :quest="quest"
              @complete="handleComplete"
              @skip="handleSkip"
            />
          </div>
        </section>

        <!-- ── Board Actions ── -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 animate-fade-up animate-delay-1"
        >
          <div class="flex flex-wrap gap-2">
            <button
              class="flex items-center gap-2 border border-border-default bg-bg-surface px-4 py-2 font-display text-xs tracking-wide text-text-secondary transition hover:border-accent-amber hover:text-accent-amber"
              @click="handleRefreshBoard"
            >
              <Icon icon="lucide:refresh-cw" class="size-3.5" />
              Làm Mới Bảng ({{ REFRESH_COST }}G)
            </button>
            <button
              class="flex items-center gap-2 border border-border-default bg-bg-surface px-4 py-2 font-display text-xs tracking-wide text-text-secondary transition hover:border-accent-sky hover:text-accent-sky"
              @click="handleRandomAccept"
            >
              <Icon icon="lucide:dice-5" class="size-3.5" />
              Nhận Ngẫu Nhiên
            </button>
          </div>

          <!-- Active boss indicator -->
          <div
            v-if="activeQuests.some((q) => q.isBoss)"
            class="flex items-center gap-2 text-xs font-display animate-pulse"
          >
            <Icon icon="lucide:skull" class="size-3.5 text-red-400" />
            <span class="text-red-400 font-bold">BOSS ĐANG CHờ!</span>
          </div>
        </div>

        <!-- ── Quest Board ── -->
        <section class="animate-fade-up animate-delay-2">
          <!-- Board background panel -->
          <div class="relative border border-accent-amber/20 bg-bg-surface/50 p-4 sm:p-6">
            <!-- Board texture dots -->
            <div
              class="absolute inset-0 opacity-5 pointer-events-none"
              style="
                background-image: radial-gradient(circle, #ffb830 1px, transparent 1px);
                background-size: 24px 24px;
              "
            />

            <h2 class="relative mb-6 flex items-center gap-3 font-display text-lg font-semibold">
              <span class="text-accent-amber text-sm tracking-widest">//</span>
              Nhiệm Vụ Có Sẵn
              <span class="ml-auto font-display text-xs tracking-widest text-text-dim">
                {{ boardQuests.length }} NHIỆM VỤ
              </span>
            </h2>

            <!-- Quest cards grid — styled like papers pinned on board -->
            <div class="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <BountyCard
                v-for="quest in boardQuests"
                :key="quest.uid"
                :quest="quest"
                @accept="handleAccept"
              />
            </div>
          </div>
        </section>

        <!-- ── Quest Stats ── -->
        <section class="animate-fade-up animate-delay-3">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="border border-border-default bg-bg-surface p-4 text-center">
              <div class="font-display text-[10px] tracking-widest text-text-dim mb-1">
                HOÀN THÀNH
              </div>
              <div class="font-display text-2xl font-bold text-accent-coral">
                {{ player.completedCount }}
              </div>
            </div>
            <div class="border border-border-default bg-bg-surface p-4 text-center">
              <div class="font-display text-[10px] tracking-widest text-text-dim mb-1">
                TỔNG EXP
              </div>
              <div class="font-display text-2xl font-bold text-accent-amber">
                {{ player.exp }}
              </div>
            </div>
            <div class="border border-border-default bg-bg-surface p-4 text-center">
              <div class="font-display text-[10px] tracking-widest text-text-dim mb-1">VÀNG</div>
              <div class="font-display text-2xl font-bold text-accent-amber">
                {{ player.gold }}
              </div>
            </div>
            <div class="border border-border-default bg-bg-surface p-4 text-center">
              <div class="font-display text-[10px] tracking-widest text-text-dim mb-1">MÁU</div>
              <div
                class="font-display text-2xl font-bold"
                :class="hpPercent > 50 ? 'text-red-400' : 'text-red-600'"
              >
                {{ player.hp }}/{{ player.maxHp }}
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- TAB: SHOP -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <div v-if="activeTab === 'shop'" class="animate-fade-up">
        <!-- Shop header sign -->
        <div class="mb-6 text-center">
          <div
            class="inline-flex items-center gap-3 border border-accent-amber/40 bg-acc-amber/5 px-6 py-3"
          >
            <Icon icon="lucide:store" class="size-5 text-accent-amber" />
            <span class="font-display text-lg font-bold tracking-widest text-accent-amber">
              CỬA HÀNG VẬT PHẨM
            </span>
            <Icon icon="lucide:store" class="size-5 text-accent-amber" />
          </div>
        </div>

        <ShopModal :player="player" :items="SHOP_ITEMS" @buy="handleBuy" />
      </div>

      <!-- ── Footer ── -->
      <footer
        class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border-default pt-6 animate-fade-up animate-delay-4"
      >
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-sm text-text-dim transition hover:text-text-primary"
        >
          <Icon icon="lucide:arrow-left" class="size-4" />
          Về trang chủ
        </RouterLink>

        <button
          class="flex items-center gap-2 text-xs text-text-dim/50 transition hover:text-accent-coral"
          @click="handleReset"
        >
          <Icon icon="lucide:rotate-ccw" class="size-3" />
          Reset nhân vật
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.notif-enter-active,
.notif-leave-active {
  transition: all 0.3s ease;
}
.notif-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notif-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
