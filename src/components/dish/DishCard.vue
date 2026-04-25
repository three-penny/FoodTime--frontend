<template>
  <article
    class="dish-card"
    :class="{ 'is-clickable': clickable }"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <img class="dish-card__image" :src="dish.image" :alt="`${dish.name}菜品图`" />
    <div class="dish-card__content">
      <div class="dish-card__title-row">
        <h3>{{ dish.name }}</h3>
        <span class="dish-card__price">¥{{ dish.price }}</span>
      </div>

      <p v-if="showCanteen" class="dish-card__canteen">{{ dish.canteenName }}</p>
      <p class="dish-card__desc">{{ dish.description }}</p>

      <div class="dish-card__meta">
        <span>评分 {{ dish.rating.toFixed(1) }}</span>
        <span>月售 {{ dish.monthlySales }}</span>
      </div>

      <div class="dish-card__tags">
        <el-tag
          v-for="tag in safeTags"
          :key="`${dish.id}-${tag}`"
          round
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({
  name: 'DishCard',
});

const props = defineProps({
  dish: {
    type: Object,
    required: true,
  },
  showCanteen: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const safeTags = computed(() =>
  Array.isArray(props.dish.tags) && props.dish.tags.length > 0
    ? props.dish.tags
    : ['待补充标签']
);

function handleClick() {
  if (props.clickable) {
    emit('click', props.dish);
  }
}
</script>

<style scoped lang="scss">
.dish-card {
  border-radius: var(--ft-radius-md);
  border: 1px solid var(--ft-color-border);
  overflow: hidden;
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
  transition: transform var(--ft-transition-fast), box-shadow var(--ft-transition-fast);

  &.is-clickable:hover {
    cursor: pointer;
    transform: translateY(-3px);
    box-shadow: var(--ft-shadow-md);
  }
}

.dish-card__image {
  width: 100%;
  height: 190px;
  object-fit: cover;
}

.dish-card__content {
  padding: var(--ft-space-2);
}

.dish-card__title-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 22px;
    line-height: 1.2;
  }
}

.dish-card__price {
  color: var(--ft-color-primary);
  font-size: 22px;
  font-weight: 800;
}

.dish-card__canteen {
  margin: 8px 0 0;
  color: var(--ft-color-secondary);
  font-size: var(--ft-font-size-sm);
  font-weight: 600;
}

.dish-card__desc {
  margin: 8px 0 0;
  color: var(--ft-color-text-muted);
  line-height: 1.6;
}

.dish-card__meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: var(--ft-font-size-sm);
  color: var(--ft-color-text-muted);
}

.dish-card__tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
