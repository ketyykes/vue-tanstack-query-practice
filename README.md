# Vue 3 + TanStack Query 書籍管理系統

這是一個使用 Vue 3 和 TanStack Query 建立的書籍管理系統練習專案，展示了現代化的前端狀態管理和 API 資料處理技術。

## 專案簡介

本專案是一個完整的書籍管理系統，具備完整的 CRUD 功能，使用 TanStack Query 進行伺服器狀態管理，並採用 json-server 作為模擬後端 API。專案展示了如何在 Vue 3 生態系統中實現高效的資料同步和使用者體驗優化。

## 主要功能

- 📚 **書籍列表顯示** - 響應式卡片佈局展示書籍資訊
- 🔍 **即時搜尋** - 支援書名
- 📖 **書籍詳細資料** - 側邊面板顯示完整書籍資訊
- ➕ **新增書籍** - 資料新增功能
- ✏️ **編輯書籍** - 編輯和更新書籍資訊
- 🗑️ **刪除書籍** - 安全刪除機制
- ⚡ **資料預載** - 滑鼠懸停時預先載入書籍詳細資料
- 🔄 **智能快取** - TanStack Query 自動快取和背景更新

## 技術棧

### 核心框架
- **Vue 3** - 使用 Composition API 和 `<script setup>` 語法
- **Vite** - 快速建置工具和開發伺服器
- **TanStack Query** - 強大的伺服器狀態管理庫
- **Vue Router** - 前端路由管理
- **Pinia** - 輕量級狀態管理庫

### UI 與樣式
- **Tailwind CSS** - 實用優先的 CSS 框架
- **SASS** - CSS 預處理器

### 開發工具
- **TypeScript 風格 JSDoc** - JSDoc 型別標註
- **ESLint + Prettier** - 程式碼品質控制和格式化
- **Stylelint** - CSS 程式碼品質檢查
- **Vue DevTools** - Vue 開發者工具

### 後端與資料
- **json-server** - 模擬 REST API 伺服器
- **Axios** - HTTP 客戶端庫

## 開發環境需求

- **Node.js** 20+ 版本
- **pnpm** 9+ 版本（建議使用 pnpm 作為套件管理器）

## 建議的開發環境設定

### VS Code 插件

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 專案設定

### 1. 安裝依賴
```bash
pnpm install
```

### 2. 啟動開發環境
```bash
# 啟動前端開發伺服器（支援熱重載）
pnpm dev

# 啟動模擬後端 API 伺服器
pnpm server
```

開發伺服器會在以下埠號運行：
- 前端：http://localhost:5173
- 後端 API：http://localhost:3004

### 3. 建置生產版本
```bash
# 建置生產版本
pnpm build

# 預覽建置結果
pnpm preview
```

## 程式碼品質與測試

```bash
# 執行程式碼格式化
pnpm format

# 執行 ESLint 檢查與自動修復
pnpm lint

# 執行單元測試
pnpm test:unit
```

## 專案結構

```
vue-tanstak-query-practice/
├── db.json                    # 模擬資料庫（json-server）
├── src/
│   ├── api/                   # API 相關檔案
│   │   ├── api.js            # API 介面定義
│   │   └── types/            # TypeScript 型別定義
│   ├── components/           # 通用組件
│   ├── query/                # TanStack Query 相關設定
│   ├── router/               # Vue Router 路由設定
│   ├── stores/               # Pinia 狀態管理
│   ├── views/                # 頁面組件
│   │   └── TanstackView/     # 書籍管理主頁面
│   │       ├── components/   # 書籍管理相關組件
│   │       │   ├── BookList.vue
│   │       │   ├── BookDetailPanel.vue
│   │       │   ├── BookAddForm.vue
│   │       │   ├── BookEditForm.vue
│   │       │   └── SearchFilter.vue
│   │       └── TanstackView.vue
│   └── style/                # 全域樣式
└── public/                   # 靜態資源
```

## 開發指南

### TanStack Query 使用模式

本專案展示了 TanStack Query 的最佳實踐：

1. **Query Keys** - 使用結構化的查詢鍵
2. **Mutations** - 處理 CUD 操作
3. **Prefetching** - 預載機制

### 型別安全

專案使用 TypeScript 風格的 JSDoc 註解，確保：
- 完整的型別標註
- IntelliSense 支援
- 編譯時型別檢查

### 程式碼風格

遵循專案的程式碼風格指南：
- 函式名稱使用 camelCase
- 型別定義使用 PascalCase
- JSDoc 型別標註

## API 資料格式

### 書籍資料結構
```typescript
interface Book {
  id: string
  title: string
  author: string
  authorId: number
  categoryId: number
  price: number
  originalPrice: number
  isbn: string
  publisher: string
  publishDate: string
  pages: number
  language: string
  description: string
  coverImage: string
  stock: number
  rating: number
  reviews: number
  isRecommended: boolean
}
```

## 相關文件

### 官方文件
- [Vue 3 文件](https://vuejs.org/)
- [TanStack Query 文件](https://tanstack.com/query/latest/docs/framework/vue/overview)
- [Pinia 文件](https://pinia.vuejs.org/)
- [Vue Router 文件](https://router.vuejs.org/)
- [Vite 文件](https://vitejs.dev/)

### 開發工具
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [ESLint 文件](https://eslint.org/)
- [Prettier 文件](https://prettier.io/)
- [Vitest 文件](https://vitest.dev/)

### 相關套件
- [json-server 文件](https://github.com/typicode/json-server)
- [Axios 文件](https://axios-http.com/)

### 參考資料

- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [React Query Data Transformations](https://tkdodo.eu/blog/react-query-data-transformations)
- [React Query Render Optimizations](https://tkdodo.eu/blog/react-query-render-optimizations)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)