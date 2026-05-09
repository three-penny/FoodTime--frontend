<!-- @author XXXXX -->

<template>
  <fieldset class="star-rating-input">
    <legend>星级</legend>
    <span v-for="star in 5" :key="star" class="star-rating-input__star">
      <span class="star-rating-input__base">☆</span>
      <span class="star-rating-input__fill" :style="{ width: getFillWidth(star) }">★</span>
      <button
        class="star-rating-input__hit star-rating-input__hit--left"
        type="button"
        :aria-label="`${star - 0.5} 星`"
        @click="emit('update:modelValue', star - 0.5)"
        @mouseenter="hoverRating = star - 0.5"
        @mouseleave="hoverRating = 0"
      ></button>
      <button
        class="star-rating-input__hit star-rating-input__hit--right"
        type="button"
        :aria-label="`${star} 星`"
        @click="emit('update:modelValue', star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
      ></button>
    </span>
  </fieldset>
</template>

<script setup>
/**
 * StarRatingInput
 * 职责：提供支持半星的五颗星点击式评分输入。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：菜品点评表单。
 * 依赖：Vue 组合式 API。
 * 输入输出边界：通过 modelValue 接收当前评分，通过 update:modelValue 输出星级。
 */
import { computed, ref } from 'vue';

defineOptions({
  name: 'StarRatingInput',
});

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:modelValue']);
const hoverRating = ref(0);
const displayRating = computed(() => hoverRating.value || props.modelValue);

function getFillWidth(star) {
  if (displayRating.value >= star) {
    return '100%';
  }

  if (displayRating.value >= star - 0.5) {
    return '50%';
  }

  return '0%';
}
</script>

<style scoped lang="scss">
.star-rating-input {
  border: 0;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.star-rating-input legend {
  color: var(--ft-color-text-muted);
  font-size: 14px;
  margin-right: 8px;
}

.star-rating-input__star {
  position: relative;
  display: inline-block;
  color: rgb(58 36 24 / 36%);
  font-size: 36px;
  line-height: 1;
  width: 34px;
  height: 38px;
}

.star-rating-input__fill {
  position: absolute;
  inset: 0 auto 0 0;
  color: var(--zine-foil-gold);
  overflow: hidden;
  pointer-events: none;
  white-space: nowrap;
}

.star-rating-input__base {
  pointer-events: none;
}

.star-rating-input__hit {
  position: absolute;
  top: 0;
  bottom: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.star-rating-input__hit--left {
  left: 0;
  width: 50%;
}

.star-rating-input__hit--right {
  right: 0;
  width: 50%;
}

@media (max-width: 420px) {
  .star-rating-input {
    flex-wrap: wrap;
  }

  .star-rating-input legend {
    width: 100%;
  }
}
</style>
