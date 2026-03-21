<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useNow } from '@vueuse/core'
import type { ActiveQuest } from '../types'

const props = defineProps<{
  quest: ActiveQuest | null
  active: boolean
}>()

const emit = defineEmits<{
  complete: []
  fail: []
}>()

const now = useNow({ interval: 1000 })

const remainingMs = computed(() => {
  if (!props.quest) return 0
  return Math.max(0, props.quest.endTime - now.value.getTime())
})

const progressPercent = computed(() => {
  if (!props.quest) return 0
  const total = props.quest.endTime - props.quest.acceptedAt
  return Math.round((remainingMs.value / total) * 100)
})

const timeLabel = computed(() => {
  const totalSec = Math.floor(remainingMs.value / 1000)
  if (totalSec <= 0) return '00:00'
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const isCritical = computed(() => progressPercent.value < 30)

function handleComplete() {
  emit('complete')
}

function handleFail() {
  emit('fail')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="boss-fade">
      <div
        v-if="active && quest"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <!-- Boss Modal -->
        <div
          class="relative mx-4 w-full max-w-md border-2 border-red-500 bg-bg-deep"
          :class="isCritical ? 'animate-pulse' : ''"
        >
          <!-- Warning stripes top -->
          <div class="flex overflow-hidden" style="height: 6px">
            <div v-for="n in 20" :key="n" class="flex-1 odd:bg-red-500 even:bg-bg-deep" />
          </div>

          <!-- Header -->
          <div class="border-b border-red-500/30 bg-red-500/10 px-6 py-4 text-center">
            <div class="flex items-center justify-center gap-3 mb-2">
              <Icon icon="lucide:skull" class="size-8 text-red-400" />
              <h2 class="font-display text-2xl font-bold tracking-widest text-red-400">
                ⚠ SỰ KIỆN BOSS
              </h2>
              <Icon icon="lucide:skull" class="size-8 text-red-400" />
            </div>
            <p class="font-display text-xs tracking-widest text-text-dim">
              — MỐI ĐE DỌA XUẤT HIỆN —
            </p>
          </div>

          <!-- Content -->
          <div class="px-6 py-6 space-y-4">
            <!-- Quest Name -->
            <div class="text-center">
              <div class="mb-1 font-display text-xs tracking-widest text-red-400">
                NHIỆM VỤ BOSS
              </div>
              <h3 class="font-display text-xl font-bold text-text-primary">{{ quest.name }}</h3>
              <p class="mt-2 text-sm text-text-secondary">{{ quest.description }}</p>
            </div>

            <!-- Timer -->
            <div class="text-center">
              <div
                class="font-display text-5xl font-bold tabular-nums transition-colors"
                :class="isCritical ? 'text-red-400' : 'text-accent-amber'"
              >
                {{ timeLabel }}
              </div>
              <div class="mt-2 h-2 bg-bg-elevated overflow-hidden">
                <div
                  class="h-full transition-all duration-1000"
                  :class="isCritical ? 'bg-red-500' : 'bg-accent-amber'"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>
            </div>

            <!-- Stakes -->
            <div class="grid grid-cols-2 gap-3 text-center">
              <div class="border border-red-500/30 bg-red-500/10 p-3">
                <div class="font-display text-xs tracking-wide text-red-400 mb-1">THẤT BẠI</div>
                <div class="font-display text-sm text-red-300">-50% HP tối đa</div>
              </div>
              <div class="border border-accent-amber/30 bg-accent-amber/10 p-3">
                <div class="font-display text-xs tracking-wide text-accent-amber mb-1">
                  CHIẾN THẮNG
                </div>
                <div class="font-display text-sm text-accent-amber">
                  +{{ quest.exp * 3 }} EXP (x3!)
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-2">
              <button
                class="flex-1 border-2 border-accent-coral bg-accent-coral/10 py-3 font-display text-sm tracking-widest text-accent-coral transition hover:bg-accent-coral/20 uppercase"
                @click="handleComplete"
              >
                ✅ CHIẾN THẮNG
              </button>
              <button
                class="flex-1 border-2 border-red-500/50 py-3 font-display text-sm tracking-widest text-red-400/70 transition hover:border-red-500 hover:text-red-400 uppercase"
                @click="handleFail"
              >
                💀 Bỏ cuộc
              </button>
            </div>

            <p class="text-center font-display text-xs text-text-dim">
              ⚠ Hoàn thành nhiệm vụ này trong thực tế để chiến thắng!
            </p>
          </div>

          <!-- Warning stripes bottom -->
          <div class="flex overflow-hidden" style="height: 6px">
            <div v-for="n in 20" :key="n" class="flex-1 odd:bg-red-500 even:bg-bg-deep" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.boss-fade-enter-active,
.boss-fade-leave-active {
  transition: all 0.3s ease;
}
.boss-fade-enter-from,
.boss-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
