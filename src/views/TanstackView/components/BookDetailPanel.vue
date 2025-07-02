<script setup>
import BookDetails from './BookDetails.vue'
import BookEditForm from './BookEditForm.vue'

/** @typedef {import('../../../api/types/api').Book} Book */

defineProps({
  /** @type {import('vue').PropType<number | null>} */
  selectedBookId: { type: Number, default: null },
  /** @type {import('vue').PropType<Book | undefined>} */
  selectedBook: { type: Object, default: undefined },
  /** @type {import('vue').PropType<boolean>} */
  isBookLoading: { type: Boolean, default: false },
  /** @type {import('vue').PropType<Book | null>} */
  editingBook: { type: Object, default: null },
  /** @type {import('vue').PropType<Partial<Book>>} */
  editForm: { type: Object, required: true },
  /** @type {import('vue').PropType<boolean>} */
  isUpdatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['formChange', 'update', 'cancel'])

/**
 * @param {keyof Book} field
 * @param {string | number} value
 */
const onFormChange = (field, value) => {
  emit('formChange', field, value)
}
</script>

<template>
  <div>
    <!-- 編輯模式 -->
    <BookEditForm
      v-if="editingBook"
      :editForm="editForm"
      :isUpdatePending="isUpdatePending"
      @formChange="onFormChange"
      @update="emit('update')"
      @cancel="emit('cancel')"
    />
    <!-- 詳情模式 -->
    <div v-else>
      <h2 class="mb-3 text-xl font-semibold">書籍詳情</h2>
      <!-- 未選擇書籍 -->
      <div v-if="!selectedBookId" class="p-5 text-center text-gray-600">
        請選擇一本書查看詳情
      </div>
      <!-- 詳情內容 -->
      <div v-else>
        <!-- 載入中 -->
        <div v-if="isBookLoading">載入詳情中...</div>
        <!-- 顯示詳情 -->
        <BookDetails v-else-if="selectedBook" :book="selectedBook" />
        <!-- 找不到書籍 -->
        <div v-else class="p-5 text-center text-gray-600">找不到該書籍</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
