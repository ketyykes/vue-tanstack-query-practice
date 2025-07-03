<script setup>
import { computed } from 'vue'

/** @typedef {import('../../../api/types/api').Book} Book */

const props = defineProps({
  /** @type {import('vue').PropType<Book>} */
  book: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  isDeletePending: { type: Boolean, default: false },
  isUpdatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['selectBook', 'edit', 'delete', 'bookHover'])

/**
 * 動態計算元件的 class
 *
 * @type {import('vue').ComputedRef<string>}
 */
const itemClassName = computed(() => {
  const baseClass =
    'p-3 border-1 border-gray-100 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-blue-200/50 hover:border-blue-400 hover:border-2 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:-translate-y-1 rounded-lg'
  const selectedClass = props.isSelected ? 'bg-blue-200' : 'bg-transparent'
  return `${baseClass} ${selectedClass}`
})

/**
 * 處理編輯事件
 *
 * @type {(e: MouseEvent) => void}
 */
const handleEdit = (e) => {
  e.stopPropagation()
  emit('edit', props.book)
}

/**
 * 處理刪除事件
 *
 * @type {(e: MouseEvent) => void}
 */
const handleDelete = (e) => {
  e.stopPropagation()
  emit('delete', props.book.id)
}

const onSelectBook = () => {
  emit('selectBook', props.book)
}
</script>

<template>
  <div
    :class="itemClassName"
    @click="onSelectBook"
    @mouseenter="emit('bookHover', book)"
  >
    <div class="font-bold">{{ book.title }}</div>
    <div class="text-sm text-gray-600">
      作者：{{ book.author }} | 出版社：{{ book.publisher }}
    </div>
    <div class="text-sm text-gray-600">
      價格：NT${{ book.price }} | 頁數：{{ book.pages }}
    </div>
    <div class="mt-2 flex gap-2">
      <button
        @click="handleEdit"
        :disabled="isUpdatePending"
        class="cursor-pointer rounded border-none bg-blue-600 px-2 py-1 text-xs text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
      >
        編輯
      </button>
      <button
        @click="handleDelete"
        :disabled="isDeletePending"
        class="cursor-pointer rounded border-none bg-red-600 px-2 py-1 text-xs text-white transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-md disabled:opacity-50"
      >
        {{ isDeletePending ? '刪除中...' : '刪除' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
