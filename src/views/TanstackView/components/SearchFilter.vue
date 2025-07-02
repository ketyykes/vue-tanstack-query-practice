<script setup>
/**
 * @type {import('vue').PropType<string>}
 * @description 搜尋欄位的值
 */
defineProps({
  /** @type {import('vue').PropType<string>} */
  modelValue: { type: String, default: '' },
})

/**
 * @type {import('vue').EmitsOptions}
 * @description 輸入變更事件
 */
const emit = defineEmits(['update:modelValue'])

/**
 * @type {(e: Event) => void}
 * @description 處理輸入變更
 */
const handleInput = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="mb-5">
    <input
      type="text"
      placeholder="搜尋書籍標題..."
      :value="modelValue"
      @input="handleInput"
      class="min-w-[300px] rounded border border-gray-300 px-3 py-2"
    />
  </div>
</template>

<style scoped></style>
