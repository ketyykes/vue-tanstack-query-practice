<template>
  <div class="polling-container">
    <h1>書籍庫存監控 - 即時輪詢</h1>

    <div v-if="status === 'loading'" class="loading">📚 載入庫存資料中...</div>

    <div v-else-if="status === 'error'" class="error">
      ❌ 錯誤：{{ error.message }}
      <button @click="refetch" class="retry-btn">重試</button>
    </div>

    <div v-else class="inventory-summary">
      <div class="summary-header">
        <h2>📊 庫存統計摘要</h2>
        <div v-if="isFetching" class="updating">🔄 更新中...</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>總書籍數</h3>
          <p class="stat-value">{{ summary.totalBooks }} 本</p>
        </div>

        <div class="stat-card">
          <h3>總庫存量</h3>
          <p class="stat-value">{{ summary.totalStock }} 件</p>
        </div>

        <div class="stat-card">
          <h3>低庫存警告</h3>
          <p class="stat-value danger" v-if="summary.lowStockCount > 0">
            {{ summary.lowStockCount }} 本
          </p>
          <p class="stat-value safe" v-else>無</p>
        </div>

        <div class="stat-card">
          <h3>庫存狀態</h3>
          <p class="stat-value" :class="summary.status">
            {{ summary.status === 'healthy' ? '健康' : '需要注意' }}
          </p>
        </div>
      </div>

      <div class="low-stock-books" v-if="summary.lowStockBooks.length > 0">
        <h3>⚠️ 低庫存書籍</h3>
        <div class="book-list">
          <div
            v-for="book in summary.lowStockBooks"
            :key="book.id"
            class="book-item"
          >
            <span class="book-title">{{ book.title }}</span>
            <span class="book-stock">剩餘 {{ book.stock }} 本</span>
          </div>
        </div>
      </div>

      <div class="last-updated">最後更新：{{ summary.updatedAt }}</div>
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

<style scoped>
.polling-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading {
  background-color: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.retry-btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #b91c1c;
}

.inventory-summary {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.updating {
  font-size: 0.9rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.stat-card {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e293b;
}

.stat-value.danger {
  color: #dc2626;
}

.stat-value.safe {
  color: #16a34a;
}

.stat-value.healthy {
  color: #16a34a;
}

.stat-value.warning {
  color: #ea580c;
}

.low-stock-books {
  margin: 2rem;
  padding: 1.5rem;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.low-stock-books h3 {
  margin: 0 0 1rem 0;
  color: #92400e;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #fde68a;
}

.book-title {
  font-weight: 500;
  color: #1f2937;
}

.book-stock {
  font-size: 0.9rem;
  color: #dc2626;
  font-weight: bold;
}

.last-updated {
  padding: 1rem 2rem;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .polling-container {
    padding: 1rem;
  }

  .summary-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .book-item {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}
</style>
