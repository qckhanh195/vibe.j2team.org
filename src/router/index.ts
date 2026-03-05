import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import HelloWorld from '@/views/hello-world/index.vue'

const DEFAULT_TITLE = 'vibe.j2team.dev - J2TEAM Community Vibe Coding'
const DEFAULT_DESCRIPTION =
  'Cả nhóm J2TEAM Community vibe code cùng nhau! Mỗi thành viên tạo một trang con, vibe code thoải mái.'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'vibe.j2team.dev - J2TEAM Community Vibe Coding',
        description:
          'Cả nhóm J2TEAM Community vibe code cùng nhau! Mỗi thành viên tạo một trang con, vibe code thoải mái.',
      },
    },
    {
      path: '/hello-world',
      name: 'hello-world',
      component: HelloWorld,
      meta: {
        title: 'Hello World - vibe.j2team.dev',
        description: 'Trang mẫu đầu tiên của dự án vibe.j2team.dev. Dùng trang này làm template để tạo trang của riêng bạn.',
      },
    },
  ],
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || DEFAULT_TITLE

  const descriptionEl = document.querySelector('meta[name="description"]')
  if (descriptionEl) {
    descriptionEl.setAttribute('content', (to.meta.description as string) || DEFAULT_DESCRIPTION)
  }
})

export default router
