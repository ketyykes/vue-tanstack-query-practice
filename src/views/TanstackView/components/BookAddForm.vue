<script setup>
/** @typedef {import('../../../api/types/api').Book} Book */

defineProps({
  /** @type {import('vue').PropType<Omit<Book, 'id'>>} */
  addForm: { type: Object, required: true },
  /** @type {import('vue').PropType<boolean>} */
  isCreatePending: { type: Boolean, default: false },
})

const emit = defineEmits(['formChange', 'create', 'cancel'])

/**
 * 處理表單輸入變更
 *
 * @param {keyof Book} field
 * @param {Event} event
 */
const handleInput = (field, event) => {
  const target = event.target
  let value = target.value
  if (target.type === 'number') {
    value = Number(value)
  } else if (target.type === 'checkbox') {
    value = target.checked
  }
  emit('formChange', field, value)
}
</script>

<template>
  <div>
    <h2 class="mb-3 text-xl font-semibold">新增書籍</h2>
    <div class="rounded border border-gray-300 p-4">
      <div class="space-y-3">
        <!-- 標題 -->
        <div>
          <label class="mb-1 block text-sm font-medium">標題：</label>
          <input
            type="text"
            :value="addForm.title"
            @input="handleInput('title', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入書籍標題"
          />
        </div>

        <!-- 作者 -->
        <div>
          <label class="mb-1 block text-sm font-medium">作者：</label>
          <input
            type="text"
            :value="addForm.author"
            @input="handleInput('author', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入作者姓名"
          />
        </div>

        <!-- 出版社 -->
        <div>
          <label class="mb-1 block text-sm font-medium">出版社：</label>
          <input
            type="text"
            :value="addForm.publisher"
            @input="handleInput('publisher', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入出版社"
          />
        </div>

        <!-- 出版日期 -->
        <div>
          <label class="mb-1 block text-sm font-medium">出版日期：</label>
          <input
            type="date"
            :value="addForm.publishDate"
            @input="handleInput('publishDate', $event)"
            class="w-full rounded border border-gray-300 p-2"
          />
        </div>

        <!-- 價格 -->
        <div>
          <label class="mb-1 block text-sm font-medium">價格：</label>
          <input
            type="number"
            :value="addForm.price"
            @input="handleInput('price', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入價格"
            min="0"
          />
        </div>

        <!-- 原價 -->
        <div>
          <label class="mb-1 block text-sm font-medium">原價：</label>
          <input
            type="number"
            :value="addForm.originalPrice"
            @input="handleInput('originalPrice', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入原價"
            min="0"
          />
        </div>

        <!-- 頁數 -->
        <div>
          <label class="mb-1 block text-sm font-medium">頁數：</label>
          <input
            type="number"
            :value="addForm.pages"
            @input="handleInput('pages', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入頁數"
            min="1"
          />
        </div>

        <!-- ISBN -->
        <div>
          <label class="mb-1 block text-sm font-medium">ISBN：</label>
          <input
            type="text"
            :value="addForm.isbn"
            @input="handleInput('isbn', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入ISBN"
          />
        </div>

        <!-- 語言 -->
        <div>
          <label class="mb-1 block text-sm font-medium">語言：</label>
          <select
            :value="addForm.language"
            @change="handleInput('language', $event)"
            class="w-full rounded border border-gray-300 p-2"
          >
            <option value="">請選擇語言</option>
            <option value="中文">中文</option>
            <option value="英文">英文</option>
            <option value="日文">日文</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 評分 -->
        <div>
          <label class="mb-1 block text-sm font-medium">評分：</label>
          <input
            type="number"
            :value="addForm.rating"
            @input="handleInput('rating', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入評分 (0-5)"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        <!-- 庫存 -->
        <div>
          <label class="mb-1 block text-sm font-medium">庫存：</label>
          <input
            type="number"
            :value="addForm.stock"
            @input="handleInput('stock', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入庫存數量"
            min="0"
          />
        </div>

        <!-- 評論數 -->
        <div>
          <label class="mb-1 block text-sm font-medium">評論數：</label>
          <input
            type="number"
            :value="addForm.reviews"
            @input="handleInput('reviews', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入評論數"
            min="0"
          />
        </div>

        <!-- 作者 ID -->
        <div>
          <label class="mb-1 block text-sm font-medium">作者 ID：</label>
          <input
            type="number"
            :value="addForm.authorId"
            @input="handleInput('authorId', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入作者 ID"
            min="1"
          />
        </div>

        <!-- 分類 ID -->
        <div>
          <label class="mb-1 block text-sm font-medium">分類 ID：</label>
          <input
            type="number"
            :value="addForm.categoryId"
            @input="handleInput('categoryId', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入分類 ID"
            min="1"
          />
        </div>

        <!-- 封面圖片 -->
        <div>
          <label class="mb-1 block text-sm font-medium">封面圖片 URL：</label>
          <input
            type="text"
            :value="addForm.coverImage"
            @input="handleInput('coverImage', $event)"
            class="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入封面圖片網址"
          />
        </div>

        <!-- 推薦 -->
        <div>
          <label class="mb-1 flex items-center">
            <input
              type="checkbox"
              :checked="addForm.isRecommended"
              @change="handleInput('isRecommended', $event)"
              class="mr-2"
            />
            <span class="text-sm font-medium">推薦書籍</span>
          </label>
        </div>

        <!-- 描述 -->
        <div>
          <label class="mb-1 block text-sm font-medium">描述：</label>
          <textarea
            :value="addForm.description"
            @input="handleInput('description', $event)"
            class="w-full rounded border border-gray-300 p-2"
            rows="3"
            placeholder="請輸入書籍描述"
          />
        </div>

        <!-- 操作按鈕 -->
        <div class="flex space-x-2 pt-3">
          <button
            @click="$emit('create')"
            :disabled="isCreatePending"
            class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isCreatePending ? '新增中...' : '新增書籍' }}
          </button>
          <button
            @click="$emit('cancel')"
            class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用 Tailwind CSS 樣式，保持一致性 */
</style>
