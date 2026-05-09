<!-- @author XXXXX -->

<template>
  <section class="dish-review-panel">
    <div class="section-rule">
      <span class="section-rule__index">09</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="dish-review-panel__header">
      <div>
        <span class="sticker sticker--r-1">菜品点评</span>
        <h2 class="section-title">{{ dishName }} 的用户评论</h2>
        <p class="section-subtitle">这里汇总所有同学对这道菜的星级和文字评论。</p>
      </div>
      <button class="button-ink is-primary" type="button" @click="emit('review')">
        点评这道菜
      </button>
    </header>

    <div class="dish-review-list">
      <article v-for="review in reviews" :key="review.id" class="dish-review-card">
        <div class="dish-review-card__top">
          <strong>{{ review.reviewer }}</strong>
          <span>{{ review.createdAt }}</span>
        </div>
        <div class="dish-review-card__stars" :aria-label="`${review.rating} 星点评`">
          <span
            v-for="star in 5"
            :key="star"
            :class="{ 'is-active': star <= review.rating }"
          >
            {{ star <= review.rating ? '★' : '☆' }}
          </span>
        </div>
        <p>{{ review.comment }}</p>
      </article>

      <p v-if="reviews.length === 0" class="dish-review-list__empty torn-edge">
        还没有同学点评这道菜，第一条评论可以从这里开始。
      </p>
    </div>
  </section>
</template>

<script setup>
/**
 * DishReviewPanel
 * 职责：承载菜品详情页的用户评论列表，并提供进入点评页面的入口。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：菜品详情页中对单个菜品进行评分和文字评论。
 * 依赖：Vue 组合式 API、父组件传入的点评数据。
 * 输入输出边界：通过 props 接收菜品名和点评列表，通过 review 事件通知父页面跳转点评。
 */
defineOptions({
  name: 'DishReviewPanel',
});

defineProps({
  dishName: {
    type: String,
    required: true,
  },
  reviews: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['review']);
</script>

<style scoped lang="scss">
.dish-review-panel {
  margin-top: var(--ft-space-4);
}

.dish-review-panel__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--ft-space-2);
  margin-bottom: var(--ft-space-2);
}

.dish-review-card__stars .is-active {
  color: var(--zine-foil-gold);
}

.dish-review-list {
  display: grid;
  gap: 12px;
}

.dish-review-card {
  border: 1px dashed rgb(58 36 24 / 32%);
  background: rgb(255 250 240 / 74%);
  padding: 14px;
}

.dish-review-card__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.dish-review-card__top strong {
  font-family: var(--ft-font-family-title);
  font-size: 20px;
}

.dish-review-card__top span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.dish-review-card__stars {
  color: rgb(58 36 24 / 36%);
  font-size: 22px;
  letter-spacing: 0;
  margin-top: 4px;
}

.dish-review-card p,
.dish-review-list__empty {
  margin: 8px 0 0;
  color: var(--ft-color-secondary-soft);
}

.dish-review-list__empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: 16px;
}

@media (max-width: 760px) {
  .dish-review-panel__header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 520px) {
  .dish-review-panel__header .button-ink {
    width: 100%;
  }

  .dish-review-card,
  .dish-review-list__empty {
    padding: 12px;
  }
}
</style>
