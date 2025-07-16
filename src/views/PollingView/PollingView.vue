<template>
  <div class="mx-auto max-w-6xl p-8">
    <h1 class="mb-8 text-3xl font-bold text-gray-800">
      書籍庫存監控 - 即時輪詢
    </h1>

    <div
      v-if="status === 'loading'"
      class="my-4 rounded-lg border border-blue-200 bg-blue-50 p-8 text-center text-blue-700"
    >
      📚 載入庫存資料中...
    </div>

    <div
      v-else-if="status === 'error'"
      class="my-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600"
    >
      ❌ 錯誤：{{ error.message }}
      <button
        @click="refetch"
        class="ml-4 cursor-pointer rounded border-none bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
      >
        重試
      </button>
    </div>

    <div v-else class="overflow-hidden rounded-xl bg-white shadow-lg">
      <div
        class="flex flex-col items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white md:flex-row"
      >
        <h2 class="m-0 text-2xl font-semibold">📊 庫存統計摘要</h2>
        <div v-if="isFetching" class="mt-2 text-sm opacity-90 md:mt-0">
          🔄 更新中...
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 p-8 md:grid-cols-2 lg:grid-cols-4">
        <div
          class="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center"
        >
          <h3 class="m-0 mb-2 text-sm font-medium text-slate-600">總書籍數</h3>
          <p class="m-0 text-2xl font-bold text-slate-800">
            {{ summary.totalBooks }} 本
          </p>
        </div>

        <div
          class="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center"
        >
          <h3 class="m-0 mb-2 text-sm font-medium text-slate-600">總庫存量</h3>
          <p class="m-0 text-2xl font-bold text-slate-800">
            {{ summary.totalStock }} 件
          </p>
        </div>

        <div
          class="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center"
        >
          <h3 class="m-0 mb-2 text-sm font-medium text-slate-600">
            低庫存警告
          </h3>
          <p
            class="m-0 text-2xl font-bold"
            :class="
              summary.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'
            "
          >
            {{
              summary.lowStockCount > 0 ? `${summary.lowStockCount} 本` : '無'
            }}
          </p>
        </div>

        <div
          class="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center"
        >
          <h3 class="m-0 mb-2 text-sm font-medium text-slate-600">庫存狀態</h3>
          <p
            class="m-0 text-2xl font-bold"
            :class="
              summary.status === 'healthy'
                ? 'text-green-600'
                : 'text-orange-600'
            "
          >
            {{ summary.status === 'healthy' ? '健康' : '需要注意' }}
          </p>
        </div>
      </div>

      <div
        v-if="summary.lowStockBooks.length > 0"
        class="mx-8 mb-8 rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-6"
      >
        <h3 class="m-0 mb-4 text-yellow-800">⚠️ 低庫存書籍</h3>
        <div class="flex flex-col gap-2">
          <div
            v-for="book in summary.lowStockBooks"
            :key="book.id"
            class="flex flex-col items-center justify-between gap-1 rounded border border-yellow-200 bg-white p-2 text-center md:flex-row md:gap-0 md:text-left"
          >
            <span class="font-medium text-gray-800">{{ book.title }}</span>
            <span class="text-sm font-bold text-red-600"
              >剩餘 {{ book.stock }} 本</span
            >
          </div>
        </div>
      </div>

      <div
        class="border-t border-slate-200 bg-slate-100 px-8 py-4 text-center text-sm text-slate-600"
      >
        最後更新：{{ summary.updatedAt }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'

/**
 * @typedef {Object} BookSummary - 書籍摘要型別
 * @property {string} id - 書籍 ID
 * @property {string} title - 書籍標題
 * @property {number} stock - 庫存數量
 */

/**
 * @typedef {Object} InventorySummary - 庫存統計摘要型別
 * @property {number} totalBooks - 總書籍數量
 * @property {number} totalStock - 總庫存數量
 * @property {number} lowStockCount - 低庫存書籍數量
 * @property {'healthy' | 'warning'} status - 庫存狀態
 * @property {BookSummary[]} lowStockBooks - 低庫存書籍列表
 * @property {string} updatedAt - 更新時間
 */

// 1️⃣ 資料抓取函式：從 json-server 取得書籍資料並計算統計
/** @type {(options: { signal?: AbortSignal }) => Promise<InventorySummary>} */
const fetchInventorySummary = async ({ signal }) => {
  try {
    // 從 json-server 取得所有書籍資料
    const { data: books } = await axios.get('http://localhost:3004/books', {
      signal,
    })

    // 計算統計資料
    const totalBooks = books.length
    const totalStock = books.reduce((sum, book) => sum + book.stock, 0)
    const lowStockThreshold = 15 // 低庫存警戒線
    const lowStockBooks = books
      .filter((book) => book.stock < lowStockThreshold)
      .map((book) => ({
        id: book.id,
        title: book.title,
        stock: book.stock,
      }))

    const lowStockCount = lowStockBooks.length
    const status = lowStockCount > 0 ? 'warning' : 'healthy'

    return {
      totalBooks,
      totalStock,
      lowStockCount,
      status,
      lowStockBooks,
      updatedAt: new Date().toLocaleString('zh-TW'),
    }
  } catch (error) {
    console.error('抓取庫存資料失敗：', error)
    throw error
  }
}

// 2️⃣ Vue Query 設定：輪詢庫存資料
const {
  data: summary, // 統計摘要資料
  isFetching, // 背景重新抓取狀態
  status, // 查詢狀態
  error, // 錯誤資訊
  refetch, // 手動重新抓取函式
} = useQuery({
  queryKey: ['inventory', 'summary'],
  queryFn: fetchInventorySummary,
  // 資料每次都視為過期，確保能立即重新抓取
  staleTime: 0,
  // 根據庫存狀態決定輪詢間隔
  /** @type {(query: import('@tanstack/vue-query').Query) => number | false} */
  refetchInterval: (query) => {
    /** @type {InventorySummary | undefined} */
    const current = query.state.data
    // 如果有低庫存警告，每 3 秒檢查一次；否則每 10 秒檢查
    return current?.status === 'warning' ? 3000 : 10000
  },
  // 視窗切到背景時仍繼續輪詢
  refetchIntervalInBackground: true,
  // 遇到錯誤時重試設定
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})
</script>
