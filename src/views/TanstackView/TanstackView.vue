<script setup>
import { ref } from 'vue'

import { useQueryClient } from '@tanstack/vue-query'

import {
  useBookQuery,
  useBooksQuery,
  useCreateBookMutation,
  useDeleteBookMutation,
  usePrefetchBook,
  useUpdateBookMutation,
} from '../../query/query.js'
import {
  BookAddForm,
  BookDetailPanel,
  BookList,
  SearchFilter,
} from './components'

const queryClient = useQueryClient()

/** @typedef {import('../../api/types/api').Book} Book */

// 本地狀態管理 - 遵循 tkdodo 的建議，保持 server state 和 client state 分離
const searchFilter = ref('')

/** @type {import('vue').Ref<string | null>} */
const selectedBookId = ref(null)

/** @type {import('vue').Ref<Book | null>} */
const editingBook = ref(null)

const searchQuery = ref('')

/** @type {import('vue').Ref<Partial<Book>>} */
const editForm = ref({})

// 新增書籍相關狀態
/** @type {import('vue').Ref<boolean>} */
const isAddingBook = ref(false)

/** @type {import('vue').Ref<Omit<Book, 'id'>>} */
const addForm = ref({
  title: '',
  author: '',
  authorId: 1,
  categoryId: 1,
  price: 0,
  originalPrice: 0,
  isbn: '',
  publisher: '',
  publishDate: '',
  pages: 0,
  language: '',
  description: '',
  coverImage: '',
  stock: 0,
  rating: 0,
  reviews: 0,
  isRecommended: false,
})

// Vue Query hooks
const {
  data: books = [],
  isLoading: booksLoading,
  error: booksError,
} = useBooksQuery(searchQuery)

const { data: selectedBook, isLoading: bookLoading } =
  useBookQuery(selectedBookId)

const { isPending: isDeletePending, mutateAsync: deleteBookMutation } =
  useDeleteBookMutation()
const { isPending: isUpdatePending, mutateAsync: updateBookMutation } =
  useUpdateBookMutation()
const { isPending: isCreatePending, mutateAsync: createBookMutation } =
  useCreateBookMutation()
const prefetchBookFn = usePrefetchBook()

// 處理書籍刪除
/**
 * 處理書籍刪除
 *
 * @type {(id: number) => Promise<void>}
 */
const handleDeleteBook = async (id) => {
  if (window.confirm('確定要刪除這本書嗎？')) {
    try {
      await deleteBookMutation(id)
      if (selectedBookId.value === id) {
        selectedBookId.value = null
      }
    } catch (error) {
      console.error('刪除書籍失敗：', error)
    }
  }
}

// 開始編輯書籍
/** @type {(book: Book) => void} */
const handleEditBook = (book) => {
  editingBook.value = book
  editForm.value = {
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    publishDate: book.publishDate,
    price: book.price,
    pages: book.pages,
    isbn: book.isbn,
    language: book.language,
    rating: book.rating,
    stock: book.stock,
    description: book.description,
  }
}

// 取消編輯
const handleCancelEdit = () => {
  editingBook.value = null
  editForm.value = {}
}

// 處理更新書籍
const handleUpdateBook = async () => {
  if (!editingBook.value) return

  try {
    await updateBookMutation({
      id: editingBook.value.id,
      data: editForm.value,
    })
    editingBook.value = null
    editForm.value = {}
    // 成功提示
    alert('書籍更新成功！')
  } catch (error) {
    console.error('更新書籍失敗：', error)
    alert('更新失敗，請稍後再試')
  }
}

// 處理表單欄位變更
/** @type {(field: keyof Book, value: string | number) => void} */
const handleFormChange = (field, value) => {
  editForm.value = {
    ...editForm.value,
    [field]: value,
  }
}

// 處理滑鼠懸停時的預填充
/** @type {(book: Book) => void} */
const handleBookHover = (book) => {
  prefetchBookFn(book.id)
}

/** @type {(book: Book) => void} */
const onSelectBook = (book) => {
  selectedBookId.value = String(book.id)
}

// 新增書籍相關函式
/** 開始新增書籍 */
const handleStartAddBook = () => {
  isAddingBook.value = true
  // 重置表單
  addForm.value = {
    title: '',
    author: '',
    authorId: 1,
    categoryId: 1,
    price: 0,
    originalPrice: 0,
    isbn: '',
    publisher: '',
    publishDate: '',
    pages: 0,
    language: '',
    description: '',
    coverImage: '',
    stock: 0,
    rating: 0,
    reviews: 0,
    isRecommended: false,
  }
}

/** 取消新增書籍 */
const handleCancelAddBook = () => {
  isAddingBook.value = false
  addForm.value = {
    title: '',
    author: '',
    authorId: 1,
    categoryId: 1,
    price: 0,
    originalPrice: 0,
    isbn: '',
    publisher: '',
    publishDate: '',
    pages: 0,
    language: '',
    description: '',
    coverImage: '',
    stock: 0,
    rating: 0,
    reviews: 0,
    isRecommended: false,
  }
}

/**
 * 處理新增書籍表單變更
 *
 * @type {(field: keyof Book, value: string | number | boolean) => void}
 */
const handleAddFormChange = (field, value) => {
  addForm.value = {
    ...addForm.value,
    [field]: value,
  }
}

/** 處理新增書籍 */
const handleCreateBook = async () => {
  try {
    await createBookMutation(addForm.value)
    isAddingBook.value = false
    // 重置表單
    addForm.value = {
      title: '',
      author: '',
      authorId: 1,
      categoryId: 1,
      price: 0,
      originalPrice: 0,
      isbn: '',
      publisher: '',
      publishDate: '',
      pages: 0,
      language: '',
      description: '',
      coverImage: '',
      stock: 0,
      rating: 0,
      reviews: 0,
      isRecommended: false,
    }
    alert('書籍新增成功！')
  } catch (error) {
    console.error('新增書籍失敗：', error)
    alert('新增失敗，請稍後再試')
  }
}

/**
 * 處理搜尋
 *
 * @type {(query: string) => void}
 */
const handleSearch = (query) => {
  searchQuery.value = query
}

const getCacheKeys = () => {
  console.log(
    'queryClient.getQueryCache().getAll()',
    queryClient.getQueryCache().getAll(),
  )
  console.log(
    'queryClient.getQueryCache().getAll().map(q=>q.queryKey)',
    queryClient
      .getQueryCache()
      .getAll()
      .map((q) => q.queryKey),
  )
}
</script>

<template>
  <button
    @click="getCacheKeys"
    class="mb-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
  >
    🔍 getCacheKeys
  </button>
  <span class="ml-5 text-sm text-gray-600">
    🔍 調試工具：點擊可在 console 查看目前 TanStack Query
    的所有快取金鑰，幫助了解快取狀態與結構
  </span>
  <div v-if="booksError" class="text-center text-red-500">
    載入書籍時發生錯誤：{{ booksError.message }}
  </div>
  <div v-else class="tanstack-page mx-auto max-w-6xl p-5">
    <h1 class="text-3xl font-bold">Vue Query 書籍管理範例</h1>
    <p class="mb-5 text-gray-600">遵循 tkdodo 最佳實踐的 Vue Query 實作範例</p>

    <SearchFilter v-model="searchFilter" @search="handleSearch" />

    <!-- 新增書籍按鈕 -->
    <div class="mb-5">
      <button
        @click="handleStartAddBook"
        class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        :disabled="isAddingBook"
      >
        {{ isAddingBook ? '正在新增...' : '新增書籍' }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-5">
      <BookList
        :books="books"
        :isLoading="booksLoading"
        :isDeletePending="isDeletePending"
        :isUpdatePending="isUpdatePending"
        :selectedBookId="selectedBookId"
        @selectBook="onSelectBook"
        @editBook="handleEditBook"
        @deleteBook="handleDeleteBook"
        @bookHover="handleBookHover"
      />

      <!-- 新增書籍表單或書籍詳細資料面板 -->
      <div v-if="isAddingBook">
        <BookAddForm
          :addForm="addForm"
          :isCreatePending="isCreatePending"
          @formChange="handleAddFormChange"
          @create="handleCreateBook"
          @cancel="handleCancelAddBook"
        />
      </div>
      <div v-else>
        <BookDetailPanel
          :selectedBookId="selectedBookId"
          :selectedBook="selectedBook"
          :isBookLoading="bookLoading"
          :editingBook="editingBook"
          :editForm="editForm"
          :isUpdatePending="updateBookMutation.isPending"
          @formChange="handleFormChange"
          @update="handleUpdateBook"
          @cancel="handleCancelEdit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
