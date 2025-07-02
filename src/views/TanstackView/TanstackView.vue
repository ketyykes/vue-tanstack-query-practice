<script setup>
import { computed, ref } from 'vue'

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { bookApi } from '../../api/types/api.js'
import { BookDetailPanel, BookList, SearchFilter } from './components'

/** @typedef {import('../../api/types/api').Book} Book */

// 本地狀態管理 - 遵循 tkdodo 的建議，保持 server state 和 client state 分離
const searchFilter = ref('')

/** @type {import('vue').Ref<number | null>} */
const selectedBookId = ref(null)

/** @type {import('vue').Ref<Book | null>} */
const editingBook = ref(null)

/** @type {import('vue').Ref<Partial<Book>>} */
const editForm = ref({})

/** @type {import('vue').Ref<number | null>} */
const deletingBookId = ref(null)

// Vue Query 用戶端
const queryClient = useQueryClient()

// Vue Query - 書籍列表查詢
const {
  data: books,
  isLoading: booksLoading,
  error: booksError,
} = useQuery({
  queryKey: computed(() => ['books', searchFilter.value]),
  queryFn: () =>
    bookApi.getAll(
      searchFilter.value ? `title_like=${searchFilter.value}` : undefined,
    ),
  select: (data) => data || [],
})

// Vue Query - 單一書籍查詢（利用 enabled 選項控制何時執行查詢）
const { data: selectedBook, isLoading: bookLoading } = useQuery({
  queryKey: computed(() => ['book', selectedBookId.value]),
  queryFn: () => bookApi.getById(selectedBookId.value),
  enabled: computed(() => !!selectedBookId.value),
})

// Vue Query - 刪除書籍變更操作
const deleteBookMutation = useMutation({
  mutationFn: (id) => bookApi.delete(id),
  onSuccess: () => {
    // 刷新書籍列表
    queryClient.invalidateQueries({ queryKey: ['books'] })
  },
})

// Vue Query - 更新書籍變更操作
const updateBookMutation = useMutation({
  mutationFn: ({ id, data }) => bookApi.update(id, data),
  onSuccess: () => {
    // 刷新書籍列表和詳情
    queryClient.invalidateQueries({ queryKey: ['books'] })
    queryClient.invalidateQueries({ queryKey: ['book'] })
  },
})

// 預填充函式
/**
 * @type {(id: number) => void}
 * @description 預填充書籍詳情，優化使用者體驗
 */
const prefetchBook = (id) => {
  queryClient.prefetchQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getById(id),
  })
}

// 處理書籍刪除
/**
 * @type {(id: number) => Promise<void>}
 * @description 處理書籍刪除
 */
const handleDeleteBook = async (id) => {
  if (window.confirm('確定要刪除這本書嗎？')) {
    try {
      deletingBookId.value = id
      await deleteBookMutation.mutateAsync(id)
      if (selectedBookId.value === id) {
        selectedBookId.value = null
      }
    } catch (error) {
      console.error('刪除書籍失敗：', error)
    } finally {
      deletingBookId.value = null
    }
  }
}

// 開始編輯書籍
/**
 * @type {(book: Book) => void}
 * @description 開始編輯書籍
 */
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
/**
 * @type {() => void}
 * @description 取消編輯
 */
const handleCancelEdit = () => {
  editingBook.value = null
  editForm.value = {}
}

// 處理更新書籍
/**
 * @type {() => Promise<void>}
 * @description 處理更新書籍
 */
const handleUpdateBook = async () => {
  if (!editingBook.value) return

  try {
    await updateBookMutation.mutateAsync({
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
/**
 * @type {(field: keyof Book, value: string | number) => void}
 * @description 處理表單欄位變更
 */
const handleFormChange = (field, value) => {
  editForm.value = {
    ...editForm.value,
    [field]: value,
  }
}

// 處理滑鼠懸停時的預填充
/**
 * @type {(id: number) => void}
 * @description 處理滑鼠懸停時的預填充
 */
const handleBookHover = (id) => {
  prefetchBook(id)
}
</script>

<template>
  <div v-if="booksError" class="error">
    載入書籍時發生錯誤：{{ booksError.message }}
  </div>
  <div v-else class="tanstack-page mx-auto max-w-6xl p-5">
    <h1 class="text-3xl font-bold">Vue Query 書籍管理範例</h1>
    <p class="mb-5 text-gray-600">遵循 tkdodo 最佳實踐的 Vue Query 實作範例</p>

    <SearchFilter v-model="searchFilter" />

    <div class="grid grid-cols-2 gap-5">
      <BookList
        :books="books || []"
        :isLoading="booksLoading"
        :selectedBookId="selectedBookId"
        :deletingBookId="deletingBookId"
        :isUpdatePending="updateBookMutation.isPending"
        @selectBook="selectedBookId = Number($event)"
        @editBook="handleEditBook"
        @deleteBook="handleDeleteBook"
        @bookHover="handleBookHover"
      />

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
</template>

<style scoped></style>
