<script setup>
import BookItem from './BookItem.vue'

/** @typedef {import('../../../api/types/api').Book} Book */

defineProps({
  /** @type {import('vue').PropType<Book[]>} */
  books: { type: Array, default: () => [] },
  /** @type {import('vue').PropType<boolean>} */
  isLoading: { type: Boolean, default: false },
  /** @type {import('vue').PropType<number | null>} */
  selectedBookId: { type: Number, default: null },
  /** @type {import('vue').PropType<number | null>} */
  deletingBookId: { type: Number, default: null },
  /** @type {import('vue').PropType<boolean>} */
  isUpdatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['selectBook', 'editBook', 'deleteBook', 'bookHover'])

/**
 * @type {(book: Book) => void}
 * @description 傳遞編輯書籍事件
 */
const onEditBook = (book) => {
  emit('editBook', book)
}

/**
 * @type {(id: number) => void}
 * @description 傳遞刪除書籍事件
 */
const onDeleteBook = (id) => {
  emit('deleteBook', id)
}
</script>

<template>
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
          @select="emit('selectBook', $event)"
          @edit="onEditBook"
          @delete="onDeleteBook"
          @bookHover="emit('bookHover', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
