<script setup>
/** @typedef {import('../../../api/types/api').Book} Book */
/**
 * @type {import('vue').PropType<Book>}
 * @description 書籍詳細資料
 */
defineProps({
  /** @type {import('vue').PropType<Book>} */
  book: { type: Object, required: true },
})
</script>

<template>
  <div class="rounded border border-gray-300 p-4">
    <h3 class="mb-3 text-lg font-semibold">{{ book.title }}</h3>
    <p class="mb-2"><strong>作者：</strong> {{ book.author }}</p>
    <p class="mb-2"><strong>出版社：</strong> {{ book.publisher }}</p>
    <p class="mb-2"><strong>出版日期：</strong> {{ book.publishDate }}</p>
    <p class="mb-2"><strong>頁數：</strong> {{ book.pages }}</p>
    <p class="mb-2"><strong>價格：</strong> NT${{ book.price }}</p>
    <p class="mb-2"><strong>ISBN:</strong> {{ book.isbn }}</p>
    <p class="mb-2"><strong>語言：</strong> {{ book.language }}</p>
    <p class="mb-2">
      <strong>評分：</strong> {{ book.rating
      }}<span v-if="book.reviews"> ({{ book.reviews }} 評論)</span>
    </p>
    <p class="mb-2"><strong>庫存：</strong> {{ book.stock }}</p>
    <p class="mb-2"><strong>描述：</strong> {{ book.description }}</p>
    <p class="mb-2"><strong>標籤：</strong> {{ book.tags?.join(', ') }}</p>
  </div>
</template>

<style scoped>
/* TODO: 保持 Tailwind CSS 樣式 */
</style>
