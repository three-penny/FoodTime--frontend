<template>
  <section class="dish-list-view">
    <el-result
      v-if="!canteen"
      icon="warning"
      title="食堂不存在"
      sub-title="请返回首页重新进入菜品列表。"
    >
      <template #extra>
        <el-button type="primary" @click="router.push({ name: 'homeCanteenSelect' })">
          返回首页
        </el-button>
      </template>
    </el-result>

    <template v-else>
      <header class="dish-list-view__header">
        <div>
          <p class="dish-list-view__tag">{{ canteen.name }} · 菜品列表</p>
          <h1>{{ canteen.name }}今天吃什么</h1>
          <p class="dish-list-view__desc">
            支持按关键词、标签与排序方式筛选，先看评分再看价格更高效。
          </p>
        </div>
        <div class="dish-list-view__header-action">
          <el-button @click="router.push({ name: 'canteenDetail', params: { canteenId } })">
            返回食堂详情
          </el-button>
        </div>
      </header>

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

      <el-empty
        v-if="dishes.length === 0"
        class="dish-list-view__empty"
        description="当前筛选条件下暂无菜品"
      />

      <div v-else class="dish-list-view__grid">
        <DishCard
          v-for="dish in dishes"
          :key="dish.id"
          :dish="dish"
          clickable
          @click="toDishDetail(dish.id)"
        />
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
.dish-list-view__header {
  margin-bottom: var(--ft-space-3);
  display: flex;
  justify-content: space-between;
  gap: var(--ft-space-2);
  align-items: flex-start;

  h1 {
    margin: 8px 0 0;
    font-size: clamp(30px, 4vw, 44px);
    line-height: 1.15;
  }
}

.dish-list-view__tag {
  margin: 0;
  font-size: var(--ft-font-size-sm);
  color: var(--ft-color-secondary);
  font-weight: 700;
}

.dish-list-view__desc {
  margin: 10px 0 0;
  color: var(--ft-color-text-muted);
}

.dish-list-view__header-action {
  display: flex;
  align-items: center;
  padding-top: 10px;
}

.dish-list-view__grid {
  margin-top: var(--ft-space-3);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ft-space-2);
}

.dish-list-view__empty {
  margin-top: var(--ft-space-4);
}

@media (max-width: 1100px) {
  .dish-list-view__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .dish-list-view__header {
    flex-direction: column;
  }

  .dish-list-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
