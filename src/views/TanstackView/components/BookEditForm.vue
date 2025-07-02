<script setup>
/** @typedef {import('../../../api/types/api').Book} Book */

defineProps({
  /** @type {import('vue').PropType<Partial<Book>>} */
  editForm: { type: Object, required: true },
  /** @type {import('vue').PropType<boolean>} */
  isUpdatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['formChange', 'update', 'cancel'])

/**
 * @param {keyof Book} field
 * @param {Event} event
 */
const handleInput = (field, event) => {
  const target = event.target
  let value = target.value
  if (target.type === 'number') {
    value = Number(value)
  }
  emit('formChange', field, value)
}
</script>

<template>
  <div>
    <h2 class="mb-3 text-xl font-semibold">編輯書籍</h2>
    <div class="rounded border border-gray-300 p-4">
      <div class="space-y-3">
        <!-- 標題 -->
        <div>
          <label class="mb-1 block text-sm font-medium">標題：</label>
          <input
            type="text"
            :value="editForm.title"
            @input="handleInput('title', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 作者 -->
        <div>
          <label class="mb-1 block text-sm font-medium">作者：</label>
          <input
            type="text"
            :value="editForm.author"
            @input="handleInput('author', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 出版社 -->
        <div>
          <label class="mb-1 block text-sm font-medium">出版社：</label>
          <input
            type="text"
            :value="editForm.publisher"
            @input="handleInput('publisher', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 出版日期 -->
        <div>
          <label class="mb-1 block text-sm font-medium">出版日期：</label>
          <input
            type="text"
            :value="editForm.publishDate"
            @input="handleInput('publishDate', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 價格 & 頁數 -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="mb-1 block text-sm font-medium">價格：</label>
            <input
              type="number"
              :value="editForm.price"
              @input="handleInput('price', $event)"
              class="w-full rounded border border-gray-300 p-2"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">頁數：</label>
            <input
              type="number"
              :value="editForm.pages"
              @input="handleInput('pages', $event)"
              class="w-full rounded border border-gray-300 p-2"
            />
          </div>
        </div>
        <!-- ISBN -->
        <div>
          <label class="mb-1 block text-sm font-medium">ISBN：</label>
          <input
            type="text"
            :value="editForm.isbn"
            @input="handleInput('isbn', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 語言 & 庫存 -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="mb-1 block text-sm font-medium">語言：</label>
            <input
              type="text"
              :value="editForm.language"
              @input="handleInput('language', $event)"
              class="w-full rounded border border-gray-300 p-2"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium">庫存：</label>
            <input
              type="number"
              :value="editForm.stock"
              @input="handleInput('stock', $event)"
              class="w-full rounded border border-gray-300 p-2"
            />
          </div>
        </div>
        <!-- 評分 -->
        <div>
          <label class="mb-1 block text-sm font-medium">評分：</label>
          <input
            type="number"
            :value="editForm.rating"
            @input="handleInput('rating', $event)"
            step="0.1"
            min="0"
            max="5"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>
        <!-- 描述 -->
        <div>
          <label class="mb-1 block text-sm font-medium">描述：</label>
          <textarea
            :value="editForm.description"
            @input="handleInput('description', $event)"
            class="h-20 w-full rounded border border-gray-300 p-2"
          ></textarea>
        </div>
      </div>
      <!-- 操作按鈕 -->
      <div class="mt-4 flex gap-2">
        <button
          @click="emit('update')"
          :disabled="isUpdatePending"
          class="cursor-pointer rounded border-none bg-green-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {{ isUpdatePending ? '更新中...' : '儲存變更' }}
        </button>
        <button
          @click="emit('cancel')"
          :disabled="isUpdatePending"
          class="cursor-pointer rounded border-none bg-gray-600 px-4 py-2 text-white disabled:opacity-50"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
