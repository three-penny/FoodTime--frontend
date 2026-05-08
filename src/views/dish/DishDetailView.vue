<!-- @author Codex -->

<template>
  <section class="dish-detail-view">
    <article v-if="!dish || !canteen" class="empty torn-edge">
      <h1>未找到该菜品</h1>
      <p>这道菜可能已经下架，回列表重新挑一份吧。</p>
      <button class="button-ink is-primary" type="button" @click="goHome">返回首页</button>
    </article>

    <template v-else>
      <div class="crumb handwrite">
        首页 / {{ canteen.name }} / {{ dish.name }}
      </div>

      <article class="dish-main torn-edge">
        <div class="dish-main__media">
          <img class="dish-main__image" :src="dish.image" :alt="`${dish.name}菜品图`" />
          <span class="sticker sticker--r2 dish-main__sticker">今日主角</span>
        </div>

        <div class="dish-main__content">
          <span class="stamp">{{ stampLabel }}</span>
          <h1>{{ dish.name }}</h1>
          <p class="dish-main__meta">
            评分 {{ dish.rating.toFixed(1) }} · {{ dish.canteenName }} · {{ dish.stall ?? dish.valueNote }}
          </p>
          <p class="dish-main__comment handwrite">
            “{{ formatComment(dish.comment, 42).text }}”
            <span>（{{ formatComment(dish.comment, 42).length }}字）</span>
          </p>

          <div class="dish-main__essay">
            <p class="dropcap">{{ dish.description ?? dish.comment }}</p>
            <p>
              在 {{ canteen.name }} 里，这道菜属于“犹豫时就点它”的那类。风味不追求花哨，
              但稳定度高，尤其适合晚课后急着吃饭的时段。
            </p>
          </div>

          <div class="dish-main__tags">
            <span v-for="tag in safeTags" :key="tag">#{{ tag }}</span>
          </div>

          <div class="dish-main__actions">
            <button class="button-ink is-primary" type="button" @click="toDishList">
              返回菜品列表
            </button>
            <button class="button-ink" type="button" @click="toCanteenDetail">
              查看食堂详情
            </button>
          </div>
        </div>
      </article>

      <section class="related">
        <div class="section-rule">
          <span class="section-rule__index">07</span>
          <span class="section-rule__line"></span>
        </div>
        <header class="related__header">
          <h2 class="section-title">同食堂你可能还想点</h2>
          <p class="section-subtitle">继续按印章和评分挑，少踩坑。</p>
        </header>
        <div class="related__grid">
          <DishCard
            v-for="(item, index) in relatedDishes"
            :key="item.id"
            :dish="item"
            :tilt="index % 2 === 0"
            :image-shape="index % 2 === 0 ? 'polygon' : 'polaroid'"
            clickable
            @click="toAnotherDish(item.id)"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DishCard from '../../components/dish/DishCard.vue';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useDishStore } from '../../store/useDishStore';
import { formatComment } from '../../utils/commentText';
import { getRatingLabel } from '../../utils/ratingLabel';

defineOptions({
  name: 'DishDetailView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();

const canteenId = computed(() => String(route.params.canteenId ?? ''));
const dishId = computed(() => String(route.params.dishId ?? ''));

const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const dish = computed(() => {
  const target = dishStore.getDishById(dishId.value);
  if (!target || target.canteenId !== canteenId.value) {
    return null;
  }
  return target;
});

const stampLabel = computed(() => {
  if (!dish.value) {
    return '再议';
  }
  return getRatingLabel(dish.value.rating);
});

const safeTags = computed(() => {
  if (!dish.value) {
    return [];
  }

  return Array.isArray(dish.value.tags) && dish.value.tags.length > 0
    ? dish.value.tags
    : [getRatingLabel(dish.value.rating)];
});

const relatedDishes = computed(() =>
  dishStore.dishes
    .filter(item => item.canteenId === canteenId.value && item.id !== dishId.value)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
);

watch(
  canteenId,
  id => {
    canteenStore.setActiveCanteen(id);
  },
  { immediate: true }
);

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

function toDishList() {
  router.push({ name: 'dishList', params: { canteenId: canteenId.value } });
}

function toCanteenDetail() {
  router.push({ name: 'canteenDetail', params: { canteenId: canteenId.value } });
}

function toAnotherDish(targetDishId) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: canteenId.value,
      dishId: targetDishId,
    },
  });
}
</script>

<style scoped lang="scss">
.empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 24px;
}

.crumb {
  margin-bottom: 10px;
  color: var(--ft-color-text-muted);
  font-size: 24px;
}

.dish-main {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
}

.dish-main__media {
  position: relative;
  border-right: 1px dashed rgb(58 36 24 / 35%);
}

.dish-main__image {
  width: 100%;
  height: 100%;
  min-height: 430px;
  object-fit: cover;
  clip-path: polygon(0 2%, 100% 0, 98% 100%, 0 96%);
}

.dish-main__sticker {
  position: absolute;
  left: 18px;
  bottom: 18px;
}

.dish-main__content {
  padding: 20px 18px;

  h1 {
    margin: 10px 0 0;
    font-family: var(--ft-font-family-title);
    font-size: clamp(44px, 6vw, 74px);
    line-height: 0.9;
  }
}

.dish-main__meta {
  margin: 12px 0 0;
  color: var(--ft-color-text-muted);
}

.dish-main__comment {
  margin: 12px 0 0;
  color: var(--ft-color-primary);
  font-size: 24px;
}

.dish-main__comment span {
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.dish-main__essay {
  margin-top: 12px;
  column-count: 2;
  column-gap: 18px;

  p {
    margin: 0 0 10px;
    color: var(--ft-color-secondary-soft);
  }
}

.dish-main__tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    border: 1px dashed rgb(58 36 24 / 38%);
    font-size: 12px;
    padding: 2px 6px;
  }
}

.dish-main__actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.related {
  margin-top: var(--ft-space-4);
}

.related__header {
  margin-bottom: var(--ft-space-2);
}

.related__grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--ft-space-2);
}

@media (max-width: 980px) {
  .dish-main,
  .related__grid {
    grid-template-columns: 1fr;
  }

  .dish-main__media {
    border-right: 0;
    border-bottom: 1px dashed rgb(58 36 24 / 35%);
  }

  .dish-main__essay {
    column-count: 1;
  }
}
</style>
