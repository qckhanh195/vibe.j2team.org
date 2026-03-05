<script setup lang="ts">
import { RouterLink } from 'vue-router'

const pages = [
  {
    name: 'Hello World',
    path: '/hello-world',
    description: 'Trang mẫu đầu tiên - bắt đầu từ đây!',
    author: 'J2TEAM',
  },
]

const techStack = [
  { name: 'Vue 3', description: 'Progressive JavaScript Framework', url: 'https://vuejs.org/' },
  { name: 'TypeScript', description: 'JavaScript với static typing', url: 'https://www.typescriptlang.org/' },
  { name: 'Vite', description: 'Build tool thế hệ mới, nhanh', url: 'https://vite.dev/' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', url: 'https://tailwindcss.com/' },
  { name: 'Vue Router', description: 'Routing cho Vue', url: 'https://router.vuejs.org/' },
  { name: 'Pinia', description: 'State management', url: 'https://pinia.vuejs.org/' },
]

const rules = [
  'Không có database — dự án không sử dụng database dưới bất kỳ hình thức nào',
  'Luôn có link về trang chủ — mỗi trang con phải có link quay lại trang chủ',
  'Ngôn ngữ: tiếng Việt (ưu tiên) hoặc tiếng Anh',
  'Không trùng ứng dụng con đã có — kiểm tra danh sách trang trước khi tạo mới',
  'Mỗi trang con hoạt động độc lập — không sửa file dùng chung ngoài route và HomePage',
  'Responsive — trang phải hiển thị tốt trên mobile',
  'Không thêm dependency mới trừ khi thật sự cần và được approve',
  'Ghi rõ tên tác giả trong mục thông tin trang',
]

const steps = [
  'Fork repo và clone về máy',
  'Tạo thư mục mới trong <code class="px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber font-mono text-xs">src/views/&lt;tên-trang&gt;/</code> với file <code class="px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber font-mono text-xs">index.vue</code>',
  'Thêm route trong <code class="px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber font-mono text-xs">src/router/index.ts</code>',
  'Thêm link trang của bạn vào mảng <code class="px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber font-mono text-xs">pages</code> trong <code class="px-1.5 py-0.5 bg-accent-amber/10 text-accent-amber font-mono text-xs">HomePage.vue</code>',
  'Tạo Pull Request và chờ merge!',
]

function padIndex(i: number): string {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <div class="min-h-screen bg-bg-deep text-text-primary font-body">
    <!-- Hero / Masthead -->
    <header class="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      <!-- Issue badge -->
      <div
        class="absolute top-8 right-4 sm:right-6 bg-accent-coral text-bg-deep font-display font-bold text-xs tracking-widest px-3 py-1.5 rotate-3 animate-fade-up animate-delay-2"
      >
        VOL.01 / 2026
      </div>

      <!-- Main title -->
      <h1
        class="font-display text-[2rem] min-[375px]:text-[2.5rem] min-[425px]:text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-text-primary -rotate-1 animate-fade-up"
      >
        vibe<span class="text-accent-coral">.</span>j2team<span class="text-accent-coral">.</span>dev
      </h1>

      <!-- Subtitle with coral left border -->
      <div class="mt-8 border-l-4 border-accent-coral pl-5 max-w-xl animate-fade-up animate-delay-3">
        <p class="text-base sm:text-lg text-text-secondary leading-relaxed">
          Sẽ thế nào nếu cả nhóm J2TEAM Community vibe code cùng nhau?
        </p>
        <p class="mt-2 text-sm text-text-dim">
          Mỗi thành viên tạo một trang con, vibe code thoải mái, rồi thêm link vào đây.
        </p>
      </div>

      <!-- Dot divider -->
      <div class="mt-12 flex flex-wrap gap-1.5 animate-fade-up animate-delay-4">
        <span v-for="n in 40" :key="n" class="w-1 h-1 rounded-full bg-border-default" />
      </div>
    </header>

    <!-- Pages Grid -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 pb-16 scroll-reveal">
      <h2 class="font-display text-2xl font-semibold text-text-primary mb-8 flex items-center gap-3">
        <span class="text-accent-coral font-display text-sm tracking-widest">//</span>
        Các trang đã tạo
      </h2>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="(page, index) in pages"
          :key="page.path"
          :to="page.path"
          class="group relative block border border-border-default bg-bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-l-4 hover:border-l-accent-coral hover:bg-bg-elevated hover:shadow-lg hover:shadow-accent-coral/5 animate-fade-up"
          :style="{ animationDelay: `${400 + index * 100}ms` }"
        >
          <!-- Background number -->
          <span
            class="absolute top-3 right-4 font-display text-6xl font-bold text-accent-amber/5 select-none pointer-events-none"
          >
            {{ padIndex(index) }}
          </span>

          <h3
            class="font-display text-lg font-semibold text-text-primary group-hover:text-accent-coral transition-colors"
          >
            {{ page.name }}
          </h3>
          <p class="mt-2 text-sm text-text-secondary">{{ page.description }}</p>
          <p class="mt-4 text-xs text-text-dim font-display tracking-wide">
            bởi {{ page.author }}
          </p>
        </RouterLink>

        <!-- Placeholder card -->
        <div
          class="flex items-center justify-center border border-dashed border-border-default p-6 text-text-dim animate-pulse-border animate-fade-up animate-delay-6"
        >
          <span class="text-sm font-display tracking-wide">Trang của bạn sẽ ở đây...</span>
        </div>
      </div>
    </main>

    <!-- Tech Stack -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 pb-16 scroll-reveal">
      <h2
        class="font-display text-2xl font-semibold text-text-primary mb-8 flex items-center gap-3"
      >
        <span class="text-accent-amber font-display text-sm tracking-widest">//</span>
        Tech Stack chung
      </h2>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="tech in techStack"
          :key="tech.name"
          :href="tech.url"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-4 border border-border-default bg-bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-amber hover:bg-bg-elevated hover:shadow-lg hover:shadow-accent-amber/5"
        >
          <div>
            <span class="font-display font-semibold text-text-primary group-hover:text-accent-amber transition-colors">
              {{ tech.name }}
            </span>
            <p class="text-xs text-text-dim mt-1">{{ tech.description }}</p>
          </div>
        </a>
      </div>
    </section>

    <!-- How to Contribute -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 pb-20 scroll-reveal">
      <h2 class="font-display text-2xl font-semibold text-text-primary mb-10 flex items-center gap-3">
        <span class="text-accent-sky font-display text-sm tracking-widest">//</span>
        Cách tham gia
      </h2>

      <div class="grid gap-8 sm:grid-cols-2">
        <div v-for="(step, i) in steps" :key="i" class="flex gap-5 items-start">
          <span class="font-display text-4xl font-bold text-accent-coral/30 leading-none shrink-0 w-12">
            {{ padIndex(i) }}
          </span>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p class="text-sm text-text-secondary leading-relaxed pt-1" v-html="step" />
        </div>
      </div>
    </section>

    <!-- Rules -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 pb-20 scroll-reveal">
      <h2 class="font-display text-2xl font-semibold text-text-primary mb-10 flex items-center gap-3">
        <span class="text-accent-coral font-display text-sm tracking-widest">//</span>
        Nguyên tắc
      </h2>

      <div class="grid gap-5 sm:grid-cols-2">
        <div v-for="(rule, i) in rules" :key="i" class="flex gap-4 items-center">
          <span class="font-display text-lg font-bold text-accent-amber/50 leading-none shrink-0 w-8">
            {{ padIndex(i) }}
          </span>
          <p class="text-sm text-text-secondary leading-relaxed">{{ rule }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t-2 border-accent-coral py-8 text-center">
      <p class="text-sm text-text-dim font-display tracking-wide">
        <span class="text-text-secondary">//</span>
        Made with vibe by
        <a
          href="https://www.facebook.com/groups/j2team.community/"
          target="_blank"
          rel="noopener"
          class="text-text-primary link-underline"
        >
          J2TEAM Community
        </a>
      </p>
    </footer>
  </div>
</template>
