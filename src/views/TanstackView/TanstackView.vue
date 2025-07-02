<script setup>
import { computed, ref } from 'vue'

import {
  useBookQuery,
  useBooksQuery,
  useDeleteBookMutation,
  usePrefetchBook,
  useUpdateBookMutation,
} from '../../query/query.js'
import { BookDetailPanel, BookList, SearchFilter } from './components'

/** @typedef {import('../../api/types/api').Book} Book */

// 本地狀態管理 - 遵循 tkdodo 的建議，保持 server state 和 client state 分離
const searchFilter = ref('')

/** @type {import('vue').Ref<string | null>} */
const selectedBookId = ref(null)

/** @type {import('vue').Ref<Book | null>} */
const editingBook = ref(null)

/** @type {import('vue').Ref<Partial<Book>>} */
const editForm = ref({})

// Vue Query hooks
const {
  data: books = [],
  isLoading: booksLoading,
  error: booksError,
} = useBooksQuery(searchFilter.value)

const { data: selectedBook, isLoading: bookLoading } = useBookQuery(
  selectedBookId,
  computed(() => !!selectedBookId.value),
)

const { isPending: isDeletePending, mutateAsync: deleteBookMutation } =
  useDeleteBookMutation()
const { isPending: isUpdatePending, mutateAsync: updateBookMutation } =
  useUpdateBookMutation()
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
  console.log('book', book)
  selectedBookId.value = String(book.id)
}
</script>

<template>
  {{ console.log('isUpdatePending', isUpdatePending) }}
  <div v-if="booksError" class="text-center text-red-500">
    載入書籍時發生錯誤：{{ booksError.message }}
  </div>
  <div v-else class="tanstack-page mx-auto max-w-6xl p-5">
    <h1 class="text-3xl font-bold">Vue Query 書籍管理範例</h1>
    <p class="mb-5 text-gray-600">遵循 tkdodo 最佳實踐的 Vue Query 實作範例</p>

    <SearchFilter v-model="searchFilter" />

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
