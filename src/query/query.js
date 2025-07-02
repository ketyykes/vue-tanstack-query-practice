import { computed } from 'vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { bookApi } from '../api/types/api.js'

/** @typedef {import('../api/types/api').Book} Book */

/**
 * 查詢金鑰工廠函式 - 遵循 tkdodo 的最佳實踐統一管理 query keys
 *
 * 結構設計原則：
 * 1. 從最通用到最具體的層級結構（['books'] -> ['books', 'list'] -> ['books', 'list', {filters}]）
 * 2. 每個層級都可獨立存取，支援靈活的快取操作（invalidation、prefetch 等）
 * 3. 避免手動宣告 key 時的錯誤，讓未來變更更容易維護
 * 4. 支援 Query Filters 的模糊匹配，方便批次操作快取
 *
 * 使用範例：
 * - bookKeys.all 可移除所有書籍相關快取
 * - bookKeys.lists() 可失效所有列表查詢
 * - bookKeys.detail(id) 可針對特定書籍操作
 */
export const bookKeys = {
  all: ['books'],
  lists: () => [...bookKeys.all, 'list'],
  list: (filters) => [...bookKeys.lists(), { filters }],
  details: () => [...bookKeys.all, 'detail'],
  detail: (id) => [...bookKeys.details(), id],
}

/**
 * 取得所有書籍的 hook
 * @type {(queryString?: string) => import('@tanstack/vue-query').UseQueryReturnType<Book[], Error>}
 * @description 查詢書籍列表，支援搜尋過濾
 */
export const useBooksQuery = (queryString) => {
  return useQuery({
    queryKey: computed(() => bookKeys.list(queryString?.value || '')),
    queryFn: () =>
      bookApi.getAll(
        queryString?.value ? `title_like=${queryString.value}` : undefined,
      ),
    // 根據 tkdodo 建議，設定合理的 staleTime
    staleTime: 5 * 60 * 1000, // 5 分鐘
    select: (data) => data || [],
  })
}

/**
 * 取得單一書籍的 hook
 * @type {(id: import('vue').Ref<number | null>, enabled?: import('vue').ComputedRef<boolean>) => import('@tanstack/vue-query').UseQueryReturnType<Book, Error>}
 * @description 查詢單一書籍詳情，可控制是否啟用
 */
export const useBookQuery = (id, enabled) => {
  return useQuery({
    queryKey: computed(() => bookKeys.detail(id.value)),
    queryFn: () => bookApi.getById(id.value),
    // 利用 enabled 選項控制何時執行查詢 - tkdodo 推薦的強大功能
    enabled: enabled || computed(() => !!id.value),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 新增書籍的 mutation hook
 * @type {() => import('@tanstack/vue-query').UseMutationReturnType<Book, Error, Omit<Book, 'id'>, unknown>}
 * @description 新增書籍並自動更新相關快取
 */
export const useCreateBookMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookData) => bookApi.create(bookData),
    onSuccess: () => {
      // 成功後使所有書籍列表失效 - 遵循 tkdodo 的快取更新策略
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
    onError: (error) => {
      console.error('新增書籍失敗：', error)
    },
  })
}

/**
 * 更新書籍的 mutation hook
 * @type {() => import('@tanstack/vue-query').UseMutationReturnType<Book, Error, { id: number; data: Partial<Book> }, unknown>}
 * @description 更新書籍並自動更新相關快取
 */
export const useUpdateBookMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => bookApi.update(id, data),
    onSuccess: (_, { id }) => {
      // 使特定書籍和列表查詢失效
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
    onError: (error) => {
      console.error('更新書籍失敗：', error)
    },
  })
}

/**
 * 刪除書籍的 mutation hook
 * @type {() => import('@tanstack/vue-query').UseMutationReturnType<void, Error, number, unknown>}
 * @description 刪除書籍並自動更新相關快取
 */
export const useDeleteBookMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => bookApi.delete(id),
    onSuccess: (_, id) => {
      // 移除特定書籍快取並使列表失效
      queryClient.removeQueries({ queryKey: bookKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() })
    },
    onError: (error) => {
      console.error('刪除書籍失敗：', error)
    },
  })
}

/**
 * 預填充書籍詳情的工具函式 - 靈感來自 tkdodo 的快取優化策略
 * @type {() => (id: number) => void}
 * @description 預先載入書籍詳情以優化使用者體驗
 */
export const usePrefetchBook = () => {
  const queryClient = useQueryClient()

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: bookKeys.detail(id),
      queryFn: () => bookApi.getById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
}
