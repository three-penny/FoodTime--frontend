<template>
  <section class="dish-list-view">
    <article v-if="!canteen" class="empty torn-edge">
      <h1>食堂不存在</h1>
      <p>链接可能已过期，回首页再选一次。</p>
      <button class="button-ink is-primary" type="button" @click="goHome">返回首页</button>
    </article>

    <template v-else>
      <header class="dish-list-view__header">
        <div class="section-rule">
          <span class="section-rule__index">06</span>
          <span class="section-rule__line"></span>
        </div>
        <p class="dish-list-view__tag">{{ canteen.name }} · 菜品档案</p>
        <h1>{{ canteen.name }}今天吃什么</h1>
        <p class="dish-list-view__desc">
          筛选规则很简单：先看印章，再看评分和“¥ / 性价比”备注，最后看同学吐槽。
        </p>
      </header>

      <div class="dish-list-view__layout">
        <aside class="dish-list-view__aside">
          <DishFilterBar
            :keyword="dishStore.filters.keyword"
            :sort-by="dishStore.filters.sortBy"
            :active-tag="dishStore.filters.tag"
            :tag-options="tagOptions"
            @update:keyword="value => dishStore.setDishFilter({ keyword: value })"
            @update:sort-by="value => dishStore.setDishFilter({ sortBy: value })"
            @update:active-tag="value => dishStore.setDishFilter({ tag: value })"
            @reset="dishStore.resetDishFilter"
          />
          <button class="button-ink" type="button" @click="toCanteenDetail">
            返回食堂详情
          </button>
        </aside>

        <div v-if="dishes.length > 0" class="dish-list-view__cards">
          <DishCard
            v-for="(dish, index) in dishes"
            :key="dish.id"
            :dish="dish"
            :tilt="index % 2 === 0"
            :image-shape="index % 3 === 0 ? 'hard' : index % 3 === 1 ? 'polygon' : 'polaroid'"
            clickable
            @click="toDishDetail(dish.id)"
          />
        </div>

        <article v-else class="dish-list-view__empty torn-edge">
          <h2>暂无结果</h2>
          <p>这个筛选太狠了，试试清空筛选条件再看。</p>
        </article>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DishCard from '../../components/dish/DishCard.vue';
import DishFilterBar from '../../components/dish/DishFilterBar.vue';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useDishStore } from '../../store/useDishStore';

defineOptions({
  name: 'DishListView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();

const canteenId = computed(() => String(route.params.canteenId ?? ''));
const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const dishes = computed(() => dishStore.getFilteredDishesByCanteen(canteenId.value));
const tagOptions = computed(() => dishStore.getTagsByCanteen(canteenId.value));

watch(
  canteenId,
  id => {
    canteenStore.setActiveCanteen(id);
    dishStore.resetDishFilter();
  },
  { immediate: true }
);

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

function toCanteenDetail() {
  router.push({ name: 'canteenDetail', params: { canteenId: canteenId.value } });
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
.empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 22px;
}

.dish-list-view__header {
  margin-bottom: var(--ft-space-3);

  h1 {
    margin: 8px 0 0;
    font-family: var(--ft-font-family-title);
    font-size: clamp(48px, 7vw, 90px);
    line-height: 0.9;
  }
}

.dish-list-view__tag {
  margin: 8px 0 0;
  color: var(--ft-color-text-muted);
}

.dish-list-view__desc {
  margin: 10px 0 0;
  max-width: 720px;
  color: var(--ft-color-secondary-soft);
}

.dish-list-view__layout {
  display: grid;
  grid-template-columns: 0.36fr 0.64fr;
  gap: var(--ft-space-2);
}

.dish-list-view__aside {
  display: grid;
  align-content: start;
  gap: 10px;
}

.dish-list-view__cards {
  display: grid;
  gap: var(--ft-space-2);
}

.dish-list-view__empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 20px;

  h2 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 36px;
  }

  p {
    margin: 8px 0 0;
  }
}

@media (max-width: 980px) {
  .dish-list-view__layout {
    grid-template-columns: 1fr;
  }
}
</style>
