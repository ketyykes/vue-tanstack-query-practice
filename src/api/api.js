import axios from 'axios'

/** @typedef {import('./types/api.js').Book} Book */

/** @type {string} */
const baseUrl = 'http://localhost:3004'

/** @type {import('axios').AxiosInstance} */
const publicService = axios.create({
  baseURL: `${baseUrl}`,
})

// 公開服務回應攔截器
publicService.interceptors.response.use(
  /** @type {(response: import('axios').AxiosResponse) => any} */
  (response) => {
    return response.data
  },
  /** @type {(error: import('axios').AxiosError) => Promise<never>} */
  (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        console.error(error)
        console.error('請求的資源不存在')
      } else if (error.response.status === 500) {
        console.error(error)
        console.error('伺服器發生錯誤')
      } else {
        console.error(error)
        console.error('發生未預期的錯誤')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * 路由工廠函式 - 產生書籍查詢 URL 字串
 *
 * @type {(queryString?: string) => string}
 */
const bookQueryRouteCreator = (queryString) => {
  const routeUrl = `/books`
  return queryString ? `${routeUrl}?${queryString}` : routeUrl
}

/**
 * 產生書籍詳細資料 URL
 *
 * @type {(id: string | number) => string}
 */
const bookDetailRouteCreator = (id) => `/books/${id}`

/**
 * 產生書籍新增 URL
 *
 * @type {() => string}
 */
const bookAddRouteCreator = () => `/books`

/**
 * 產生書籍更新 URL
 *
 * @type {(id: string | number) => string}
 */
const bookUpdateRouteCreator = (id) => `/books/${id}`

/**
 * 產生書籍刪除 URL
 *
 * @type {(id: string | number) => string}
 */
const bookRemoveRouteCreator = (id) => `/books/${id}`

/**
 * 書籍 API 物件，包含所有書籍相關的 CRUD 操作
 *
 * @type {{
 *   getAll: (queryString?: string) => Promise<Book[]>
 *   getById: (id: number) => Promise<Book>
 *   create: (bookData: Omit<Book, 'id'>) => Promise<Book>
 *   update: (id: number, bookData: Partial<Book>) => Promise<Book>
 *   delete: (id: number) => Promise<void>
 * }}
 */
export const bookApi = {
  /**
   * 取得全部書籍（可選擇性帶入 query string）
   *
   * @type {(queryString?: string) => Promise<Book[]>}
   */
  getAll: (queryString) =>
    publicService.get(bookQueryRouteCreator(queryString)),

  /**
   * 取得特定 ID 的書籍
   *
   * @type {(id: number) => Promise<Book>}
   */
  getById: (id) => publicService.get(bookDetailRouteCreator(id)),

  /**
   * 新增書籍
   *
   * @type {(bookData: Omit<Book, 'id'>) => Promise<Book>}
   */
  create: (bookData) => publicService.post(bookAddRouteCreator(), bookData),

  /**
   * 更新書籍
   *
   * @type {(id: number, bookData: Partial<Book>) => Promise<Book>}
   */
  update: (id, bookData) =>
    publicService.put(bookUpdateRouteCreator(id), bookData),

  /**
   * 刪除書籍
   *
   * @type {(id: number) => Promise<void>}
   */
  delete: (id) => publicService.delete(bookRemoveRouteCreator(id)),
}

// 匯出服務實例
export { publicService }

// 預設匯出
export default bookApi
