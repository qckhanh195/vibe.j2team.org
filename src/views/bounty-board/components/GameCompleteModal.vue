<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { PlayerState } from '../types'

defineProps<{
  player: PlayerState
}>()

const emit = defineEmits<{
  continue: []
  reset: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style="background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(8px)"
    >
      <!-- Starfield particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          v-for="i in 30"
          :key="i"
          class="absolute size-1 rounded-full bg-accent-amber opacity-60"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }"
          style="animation: pulse 2s ease-in-out infinite"
        />
      </div>

      <div class="relative w-full max-w-lg text-center">
        <!-- Top ornament -->
        <div class="flex items-center gap-3 justify-center mb-6">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent to-accent-amber/60" />
          <Icon icon="lucide:crown" class="size-6 text-accent-amber" />
          <div class="h-px flex-1 bg-gradient-to-l from-transparent to-accent-amber/60" />
        </div>

        <!-- Main title -->
        <div class="font-display text-[11px] tracking-[0.5em] text-accent-amber/70 mb-3 uppercase">
          Ngươi đã làm điều không tưởng
        </div>
        <h1
          class="font-display font-black tracking-widest mb-2"
          style="
            font-size: clamp(3rem, 12vw, 6rem);
            background: linear-gradient(135deg, #ffb830, #ff6b35, #ffb830);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          "
        >
          PHÁ ĐẢO
        </h1>
        <p class="font-display text-lg text-accent-amber tracking-wide mb-1">
          🏆 BẤT TỬ THẬT SỰ 🏆
        </p>
        <p class="text-text-secondary text-sm mb-8">
          Đạt <span class="text-accent-amber font-bold">3600 EXP</span> — Không có nhiều người đạt
          được điều này.
        </p>

        <!-- Stats card -->
        <div class="border border-accent-amber/30 bg-accent-amber/5 p-6 mb-8 text-left">
          <div
            class="font-display text-[10px] tracking-widest text-accent-amber/60 mb-4 text-center"
          >
            — THÀNH TÍCH CỦA NGƯƠI —
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="font-display text-2xl font-black text-accent-amber">{{ player.exp }}</div>
              <div class="text-xs text-text-dim font-display tracking-wider">TỔNG EXP</div>
            </div>
            <div class="text-center">
              <div class="font-display text-2xl font-black text-yellow-400">{{ player.gold }}</div>
              <div class="text-xs text-text-dim font-display tracking-wider">VÀNG CÒN LẠI</div>
            </div>
            <div class="text-center">
              <div class="font-display text-2xl font-black text-accent-coral">
                {{ player.completedCount }}
              </div>
              <div class="text-xs text-text-dim font-display tracking-wider">NHIỆM VỤ XONG</div>
            </div>
            <div class="text-center">
              <div class="font-display text-2xl font-black text-red-400">{{ player.maxHp }}</div>
              <div class="text-xs text-text-dim font-display tracking-wider">MÁU TỐI ĐA</div>
            </div>
          </div>
        </div>

        <!-- Two buttons -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Continue playing -->
          <button
            class="flex flex-col items-center gap-2 border border-accent-amber bg-accent-amber/10 px-4 py-5 font-display tracking-wide transition hover:bg-accent-amber/20 group"
            @click="emit('continue')"
          >
            <Icon
              icon="lucide:infinity"
              class="size-6 text-accent-amber group-hover:scale-110 transition-transform"
            />
            <span class="text-sm text-accent-amber font-bold">Chơi Tiếp</span>
            <span class="text-[10px] text-text-dim">Giữ lại nhân vật</span>
          </button>

          <!-- Reset -->
          <button
            class="flex flex-col items-center gap-2 border border-accent-coral bg-accent-coral/10 px-4 py-5 font-display tracking-wide transition hover:bg-accent-coral/20 group"
            @click="emit('reset')"
          >
            <Icon
              icon="lucide:rotate-ccw"
              class="size-6 text-accent-coral group-hover:rotate-180 transition-transform duration-500"
            />
            <span class="text-sm text-accent-coral font-bold">Bắt Đầu Lại</span>
            <span class="text-[10px] text-text-dim">Reset toàn bộ</span>
          </button>
        </div>

        <!-- Bottom ornament -->
        <div class="flex items-center gap-3 justify-center mt-6">
          <div class="h-px flex-1 bg-gradient-to-r from-transparent to-accent-amber/30" />
          <span class="font-display text-[10px] tracking-widest text-text-dim"
            >SS · BẤT TỬ · 3600 EXP</span
          >
          <div class="h-px flex-1 bg-gradient-to-l from-transparent to-accent-amber/30" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
