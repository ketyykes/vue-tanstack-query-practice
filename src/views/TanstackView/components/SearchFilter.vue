<script setup>
/**
 * 搜尋欄位的值
 *
 * @type {import('vue').PropType<string>}
 */
const props = defineProps({
  /** @type {import('vue').PropType<string>} */
  modelValue: { type: String, default: '' },
})

/**
 * 輸入變更事件
 *
 * @type {import('vue').EmitsOptions}
 */
const emit = defineEmits(['update:modelValue', 'search'])

/**
 * 處理輸入變更
 *
 * @type {(e: Event) => void}
 */
const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const handleSearch = () => {
  emit('search', props.modelValue)
}
</script>

<template>
  <div class="mb-5">
    <form @submit.prevent="handleSearch">
      <input
        type="text"
        id="search"
        name="search"
        placeholder="搜尋書籍標題..."
        :value="modelValue"
        @input="handleInput"
        class="min-w-[300px] rounded border border-gray-300 px-3 py-2"
      />
      <button
        class="ml-8 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        搜尋
      </button>
    </form>
  </div>
</template>

<style scoped></style>
