<script setup>
import { useRoute } from 'vue-router'

import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

/**
 * 導航項目型別定義
 *
 * @typedef {{ to: string; label: string }} NavigationItem
 */

/**
 * 導航項目清單
 *
 * @type {NavigationItem[]}
 */
const navigationItems = [
  { to: '/', label: '首頁' },
  { to: '/about', label: '關於我們' },
  { to: '/tanstack', label: 'TanStack' },
  { to: '/polling', label: 'Polling' },
]

/**
 * 判斷當前路徑是否為指定路徑
 *
 * @type {(path: string) => boolean}
 */
const route = useRoute()
const isActive = (path) => route.path === path
</script>
<template>
  <VueQueryDevtools />
  <div class="flex min-h-screen flex-col bg-gray-50">
    <!-- Header with Navigation -->
    <header class="border-b border-gray-200 bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav class="py-4">
          <div class="flex space-x-8">
            <RouterLink
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              :class="[
                'inline-flex items-center border-b-2 px-1 py-2 text-sm font-medium transition-colors duration-200',
                isActive(item.to)
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
              >{{ item.label }}</RouterLink
            >
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <!-- 公司資訊 -->
          <div>
            <h3 class="mb-4 text-lg font-semibold">關於專案</h3>
            <p class="text-sm text-gray-300">
              這是一個 Vue + TanStack Query 練習專案，
              用於學習現代前端開發技術。
            </p>
          </div>

          <!-- 快速連結 -->
          <div>
            <h3 class="mb-4 text-lg font-semibold">快速連結</h3>
            <ul class="space-y-2">
              <li>
                <RouterLink
                  to="/"
                  class="text-gray-300 transition-colors duration-200 hover:text-white"
                  >首頁</RouterLink
                >
              </li>
              <li>
                <RouterLink
                  to="/about"
                  class="text-gray-300 transition-colors duration-200 hover:text-white"
                  >關於我們</RouterLink
                >
              </li>
            </ul>
          </div>

          <!-- 技術資訊 -->
          <div>
            <h3 class="mb-4 text-lg font-semibold">使用技術</h3>
            <ul class="space-y-1 text-sm text-gray-300">
              <li>Vue 3</li>
              <li>TanStack Query</li>
              <li>JavaScript</li>
              <li>Tailwind CSS</li>
              <li>Vite</li>
            </ul>
          </div>
        </div>

        <!-- 版權資訊 -->
        <div class="mt-8 border-t border-gray-700 pt-8">
          <div class="flex flex-col items-center justify-between md:flex-row">
            <p class="text-sm text-gray-400">
              © 2024 TanStack Query 練習專案。保留所有權利。
            </p>
            <div class="mt-4 flex space-x-6 md:mt-0">
              <a
                href="#"
                class="text-gray-400 transition-colors duration-200 hover:text-white"
                >隱私政策</a
              >
              <a
                href="#"
                class="text-gray-400 transition-colors duration-200 hover:text-white"
                >服務條款</a
              >
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
<style scoped></style>
