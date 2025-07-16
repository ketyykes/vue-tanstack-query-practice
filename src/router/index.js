import { createRouter, createWebHashHistory } from 'vue-router'

import AboutView from '@/views/AboutView/AboutView.vue'
import HomeView from '@/views/HomeView/HomeView.vue'
import PollingView from '@/views/PollingView/PollingView.vue'
import TanstackView from '@/views/TanstackView/TanstackView.vue'

/** @type {import('vue-router').RouteRecordRaw[]} 路由設定，支援巢狀結構與 Layout */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/tanstack',
    name: 'tanstack',
    component: TanstackView,
  },
  {
    path: '/polling',
    name: 'polling',
    component: PollingView,
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
