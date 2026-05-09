<!-- @author XXXXX -->

<template>
  <div class="review-target-picker">
    <label>
      <span>选择餐厅</span>
      <select :value="modelValue.canteenId" @change="emitCanteenChange">
        <option value="">请选择餐厅</option>
        <option v-for="item in canteens" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </label>
    <label>
      <span>选择档口</span>
      <select
        :value="modelValue.stallName"
        :disabled="stallOptions.length === 0"
        @change="emitStallChange"
      >
        <option value="">请选择档口</option>
        <option v-for="stall in stallOptions" :key="stall" :value="stall">
          {{ stall }}
        </option>
      </select>
    </label>
    <label>
      <span>选择菜品</span>
      <select
        :value="modelValue.dishId"
        :disabled="dishOptions.length === 0"
        @change="emitDishChange"
      >
        <option value="">请选择菜品</option>
        <option v-for="item in dishOptions" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </label>
  </div>
</template>

<script setup>
/**
 * ReviewTargetPicker
 * 职责：提供点评目标的餐厅、档口、菜品三级联动选择。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：03 点评页面手动选择点评目标。
 * 依赖：父组件传入的餐厅、档口、菜品选项。
 * 输入输出边界：通过 modelValue 接收当前选择，通过 update 事件输出选择变化。
 */
defineOptions({
  name: 'ReviewTargetPicker',
});

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  canteens: {
    type: Array,
    default: () => [],
  },
  stallOptions: {
    type: Array,
    default: () => [],
  },
  dishOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select-canteen', 'select-stall', 'select-dish']);

function emitCanteenChange(event) {
  emit('select-canteen', event.target.value);
}

function emitStallChange(event) {
  emit('select-stall', event.target.value);
}

function emitDishChange(event) {
  emit('select-dish', event.target.value);
}
</script>

<style scoped lang="scss">
.review-target-picker {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.review-target-picker label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.review-target-picker select {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.review-target-picker select:disabled {
  color: rgb(58 36 24 / 42%);
  cursor: not-allowed;
}

@media (max-width: 860px) {
  .review-target-picker {
    grid-template-columns: 1fr;
  }
}
</style>
