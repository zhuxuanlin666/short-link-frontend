import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../pages/demo/DemoPage.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../pages/admin/ListPage.vue')
    },
    {
      path: '/',
      redirect: '/demo'
    }
  ],
})

export default router
