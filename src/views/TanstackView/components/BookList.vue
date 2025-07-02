<script setup>
import BookItem from './BookItem.vue'

/** @typedef {import('../../../api/types/api').Book} Book */

defineProps({
  /** @type {import('vue').PropType<Book[]>} */
  books: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  selectedBookId: { type: Number, default: null },
  deletingBookId: { type: Number, default: null },
  isUpdatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['selectBook', 'editBook', 'deleteBook', 'bookHover'])

/**
 * 傳遞編輯書籍事件
 *
 * @type {(book: Book) => void}
 */
const onEditBook = (book) => {
  emit('editBook', book)
}

const onBookHover = (book) => {
  emit('bookHover', book)
}

/**
 * 傳遞刪除書籍事件
 *
 * @type {(id: number) => void}
 */
const onDeleteBook = (id) => {
  emit('deleteBook', id)
}

/**
 * 傳遞選擇書籍事件
 *
 * @type {(book: Book) => void}
 */
const onSelectBook = (book) => {
  emit('selectBook', book)
}
</script>

<template>
  {{ console.log(selectedBookId) }}
  <div>
    <h2 class="mb-3 text-xl font-semibold">書籍列表</h2>
    <div v-if="isLoading">載入中...</div>
    <div v-else class="rounded border border-gray-300">
      <div v-if="books.length === 0" class="p-5 text-center text-gray-600">
        沒有找到符合條件的書籍
      </div>
      <div v-else>
        <BookItem
          v-for="book in books"
          :key="book.id"
          :book="book"
          :isSelected="selectedBookId === book.id"
          :isDeletePending="deletingBookId === book.id"
          :isUpdatePending="isUpdatePending"
          @selectBook="onSelectBook"
          @edit="onEditBook"
          @delete="onDeleteBook"
          @bookHover="onBookHover"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
