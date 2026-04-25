<template>
  <section class="dish-detail-view">
    <el-result
      v-if="!dish || !canteen"
      icon="warning"
      title="未找到该菜品"
      sub-title="可能已下架，建议返回菜品列表重新选择。"
    >
      <template #extra>
        <el-button type="primary" @click="router.push({ name: 'homeCanteenSelect' })">
          返回首页
        </el-button>
      </template>
    </el-result>

    <template v-else>
      <el-breadcrumb class="dish-detail-view__crumb">
        <el-breadcrumb-item :to="{ name: 'homeCanteenSelect' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'canteenDetail', params: { canteenId } }">
          {{ canteen.name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ dish.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <article class="dish-main">
        <img class="dish-main__image" :src="dish.image" :alt="`${dish.name}菜品图`" />
        <div class="dish-main__content">
          <p class="dish-main__canteen">{{ canteen.name }}</p>
          <h1>{{ dish.name }}</h1>
          <p class="dish-main__desc">{{ dish.description }}</p>

          <div class="dish-main__meta">
            <div>
              <span class="dish-main__meta-label">评分</span>
              <strong>{{ dish.rating.toFixed(1) }}</strong>
            </div>
            <div>
              <span class="dish-main__meta-label">月售</span>
              <strong>{{ dish.monthlySales }}</strong>
            </div>
            <div>
              <span class="dish-main__meta-label">价格</span>
              <strong>¥{{ dish.price }}</strong>
            </div>
          </div>

          <div class="dish-main__tags">
            <el-tag
              v-for="tag in dish.tags"
              :key="`${dish.id}-${tag}`"
              round
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>

          <div class="dish-main__action">
            <el-button type="primary" @click="toDishList">返回菜品列表</el-button>
            <el-button @click="toCanteenDetail">查看食堂详情</el-button>
          </div>
        </div>
      </article>

      <section class="related">
        <header class="related__header">
          <h2 class="section-title">同食堂你可能还喜欢</h2>
          <p class="section-subtitle">按评分筛选的相关菜品，适合一起对比后再决定。</p>
        </header>
        <div class="related__grid">
          <DishCard
            v-for="item in relatedDishes"
            :key="item.id"
            :dish="item"
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
.dish-detail-view__crumb {
  margin-bottom: var(--ft-space-2);
}

.dish-main {
  border-radius: var(--ft-radius-lg);
  overflow: hidden;
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-md);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

.dish-main__image {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
}

.dish-main__content {
  padding: var(--ft-space-3);
  display: flex;
  flex-direction: column;

  h1 {
    margin: 8px 0 0;
    font-size: clamp(30px, 4vw, 44px);
    line-height: 1.15;
  }
}

.dish-main__canteen {
  margin: 0;
  color: var(--ft-color-secondary);
  font-size: var(--ft-font-size-sm);
  font-weight: 700;
}

.dish-main__desc {
  margin: 14px 0 0;
  color: var(--ft-color-text-muted);
  line-height: 1.8;
}

.dish-main__meta {
  margin-top: var(--ft-space-2);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.dish-main__meta-label {
  display: block;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.dish-main__tags {
  margin-top: var(--ft-space-2);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish-main__action {
  margin-top: auto;
  padding-top: var(--ft-space-3);
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ft-space-2);
}

@media (max-width: 980px) {
  .dish-main {
    grid-template-columns: 1fr;
  }

  .related__grid {
    grid-template-columns: 1fr;
  }
}
</style>
