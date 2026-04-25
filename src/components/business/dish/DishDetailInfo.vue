<script setup>
defineOptions({ name: 'DishDetailInfo' });

defineProps({
  dish: {
    type: Object,
    required: true,
  },
  canteen: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <section class="dish-detail-info">
    <div class="dish-detail-info__header">
      <div>
        <p class="dish-detail-info__eyebrow">这道菜</p>
        <h2>{{ dish.name }}</h2>
        <p class="dish-detail-info__brief">{{ dish.brief }}</p>
      </div>
      <div class="dish-detail-info__price">
        <strong class="ft-number">¥{{ dish.price }}</strong>
        <span v-if="dish.originalPrice > dish.price" class="ft-number"
          >¥{{ dish.originalPrice }}</span
        >
      </div>
    </div>

    <div class="dish-detail-info__grid">
      <div>
        <span>在这吃</span>
        <strong>{{ canteen.name }} · {{ dish.windowName }}</strong>
      </div>
      <div>
        <span>适合</span>
        <strong>{{ dish.bestFor }}</strong>
      </div>
      <div>
        <span>口味</span>
        <strong>{{ dish.spicyLevel }}</strong>
      </div>
      <div>
        <span>出餐</span>
        <strong class="ft-number">{{ dish.cookingTime }}</strong>
      </div>
    </div>

    <section class="dish-detail-info__section">
      <h3>大概是什么</h3>
      <p>{{ dish.tagline }}</p>
    </section>

    <section class="dish-detail-info__section">
      <h3>主要食材</h3>
      <div class="dish-detail-info__tags">
        <span v-for="item in dish.ingredients" :key="item" class="ft-chip">{{
          item
        }}</span>
      </div>
    </section>

    <section class="dish-detail-info__section">
      <h3>补充</h3>
      <p>
        {{ canteen.queueHint }}，如果你准备去 {{ canteen.name }}，可以顺手看看
        {{ canteen.mustOrder.slice(0, 2).join('、') }}。
      </p>
    </section>
  </section>
</template>

<style scoped>
.dish-detail-info {
  display: grid;
  gap: 18px;
  padding: 20px;
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-panel);
  background: var(--ft-surface);
  box-shadow: var(--ft-shadow-soft);
}

.dish-detail-info__header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.dish-detail-info__eyebrow {
  margin: 0 0 8px;
  color: var(--ft-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dish-detail-info__header h2 {
  margin: 0 0 8px;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 34px;
}

.dish-detail-info__brief {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.7;
}

.dish-detail-info__price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
}

.dish-detail-info__price strong {
  font-size: 38px;
}

.dish-detail-info__price span {
  color: var(--ft-text-muted);
  text-decoration: line-through;
}

.dish-detail-info__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.dish-detail-info__grid div {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--ft-border);
  border-radius: 14px;
  background: var(--ft-surface-strong);
}

.dish-detail-info__grid span {
  color: var(--ft-text-muted);
  font-size: 12px;
}

.dish-detail-info__section {
  display: grid;
  gap: 8px;
}

.dish-detail-info__section h3 {
  margin: 0;
  font-size: 16px;
}

.dish-detail-info__section p {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.8;
}

.dish-detail-info__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 640px) {
  .dish-detail-info__header {
    flex-direction: column;
  }

  .dish-detail-info__grid {
    grid-template-columns: 1fr;
  }
}
</style>
