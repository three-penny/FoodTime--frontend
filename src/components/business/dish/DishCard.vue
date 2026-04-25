<script setup>
import { computed } from 'vue';

defineOptions({ name: 'DishCard' });

const props = defineProps({
  dish: {
    type: Object,
    required: true,
  },
  showCanteenName: {
    type: Boolean,
    default: false,
  },
  canteenName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select']);

const subtitle = computed(() => {
  const parts = [props.dish.windowName];

  if (props.showCanteenName && props.canteenName) {
    parts.unshift(props.canteenName);
  }

  return parts.join(' · ');
});
</script>

<template>
  <article class="dish-card">
    <img :src="dish.image" :alt="dish.name" class="dish-card__image" />

    <div class="dish-card__content">
      <div class="dish-card__top">
        <div>
          <h3>{{ dish.name }}</h3>
          <p>{{ subtitle }}</p>
        </div>
        <span class="ft-chip">{{ dish.badges[0] }}</span>
      </div>

      <p class="dish-card__brief">{{ dish.brief }}</p>

      <div class="dish-card__meta">
        <span>{{ dish.bestFor }}</span>
        <span>{{ dish.spicyLevel }}</span>
        <span class="ft-number">{{ dish.cookingTime }}</span>
      </div>

      <div class="dish-card__footer">
        <div class="dish-card__price">
          <strong class="ft-number">¥{{ dish.price }}</strong>
          <span v-if="dish.originalPrice > dish.price" class="ft-number"
            >¥{{ dish.originalPrice }}</span
          >
        </div>
        <el-button type="primary" @click="emit('select', dish.id)"
          >去看</el-button
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.dish-card {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-card);
  background: var(--ft-surface);
  box-shadow: var(--ft-shadow-soft);
}

.dish-card__image {
  width: 100%;
  height: 100%;
  min-height: 152px;
  border-radius: 14px;
  object-fit: cover;
}

.dish-card__content {
  display: grid;
  gap: 12px;
}

.dish-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.dish-card__top h3 {
  margin: 0 0 6px;
  font-size: 22px;
}

.dish-card__top p,
.dish-card__brief {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.7;
}

.dish-card__meta,
.dish-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dish-card__meta {
  color: var(--ft-text-muted);
  font-size: 13px;
}

.dish-card__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.dish-card__price strong {
  font-size: 28px;
}

.dish-card__price span {
  color: var(--ft-text-muted);
  text-decoration: line-through;
}

@media (max-width: 640px) {
  .dish-card {
    grid-template-columns: 1fr;
  }

  .dish-card__top,
  .dish-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
