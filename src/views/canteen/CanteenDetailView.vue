<template>
  <section class="canteen-detail-view">
    <el-result
      v-if="!canteen"
      icon="warning"
      title="未找到该食堂"
      sub-title="请返回首页重新选择食堂。"
    >
      <template #extra>
        <el-button type="primary" @click="router.push({ name: 'homeCanteenSelect' })">
          返回首页
        </el-button>
      </template>
    </el-result>

    <template v-else>
      <article class="hero">
        <img class="hero__image" :src="canteen.image" :alt="`${canteen.name}环境图`" />
        <div class="hero__content">
          <p class="hero__tag">食堂详情</p>
          <h1>{{ canteen.name }}</h1>
          <p class="hero__summary">{{ canteen.summary }}</p>
          <div class="hero__meta">
            <span>位置：{{ canteen.location }}</span>
            <span>营业时间：{{ canteen.openHours }}</span>
            <span>评分：{{ canteen.rating.toFixed(1) }}</span>
          </div>
          <div class="hero__action">
            <el-button type="primary" @click="toDishList">查看菜品列表</el-button>
            <el-button @click="router.push({ name: 'homeCanteenSelect' })">返回首页</el-button>
          </div>
        </div>
      </article>

      <section class="blocks">
        <article
          v-for="block in canteen.introBlocks"
          :key="`${canteen.id}-${block.title}`"
          class="blocks__item"
        >
          <h2>{{ block.title }}</h2>
          <p>{{ block.content }}</p>
        </article>
      </section>

      <section class="hot">
        <header class="hot__header">
          <h2 class="section-title">该食堂热门菜品</h2>
          <p class="section-subtitle">依据评分和销量综合排序，帮助你快速下单。</p>
        </header>

        <div class="hot__grid">
          <DishCard
            v-for="dish in hotDishes"
            :key="dish.id"
            :dish="dish"
            clickable
            @click="toDishDetail(dish.id)"
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
  name: 'CanteenDetailView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();

const canteenId = computed(() => String(route.params.canteenId ?? ''));
const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const hotDishes = computed(() =>
  dishStore.dishes
    .filter(dish => dish.canteenId === canteenId.value)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
);

watch(
  canteenId,
  id => {
    canteenStore.setActiveCanteen(id);
  },
  { immediate: true }
);

function toDishList() {
  router.push({
    name: 'dishList',
    params: { canteenId: canteenId.value },
  });
}

function toDishDetail(dishId) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: canteenId.value,
      dishId,
    },
  });
}
</script>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--ft-space-3);
  border-radius: var(--ft-radius-lg);
  overflow: hidden;
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-md);
}

.hero__image {
  width: 100%;
  height: 100%;
  min-height: 330px;
  object-fit: cover;
}

.hero__content {
  padding: var(--ft-space-3);
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    margin: 10px 0 0;
    font-size: clamp(30px, 4vw, 42px);
  }
}

.hero__tag {
  margin: 0;
  font-size: var(--ft-font-size-sm);
  color: var(--ft-color-secondary);
  font-weight: 700;
}

.hero__summary {
  margin: 14px 0 0;
  color: var(--ft-color-text-muted);
  line-height: 1.8;
}

.hero__meta {
  margin-top: 14px;
  display: grid;
  gap: 8px;
  color: var(--ft-color-text);
}

.hero__action {
  margin-top: var(--ft-space-2);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.blocks {
  margin-top: var(--ft-space-4);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ft-space-2);
}

.blocks__item {
  border-radius: var(--ft-radius-md);
  border: 1px solid var(--ft-color-border);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
  padding: var(--ft-space-3);

  h2 {
    margin: 0;
    font-size: var(--ft-font-size-lg);
  }

  p {
    margin: 10px 0 0;
    color: var(--ft-color-text-muted);
    line-height: 1.7;
  }
}

.hot {
  margin-top: var(--ft-space-4);
}

.hot__header {
  margin-bottom: var(--ft-space-2);
}

.hot__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ft-space-2);
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .blocks,
  .hot__grid {
    grid-template-columns: 1fr;
  }
}
</style>
