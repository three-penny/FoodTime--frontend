<template>
  <section class="dish-filter">
    <div class="dish-filter__main">
      <el-input
        :model-value="keyword"
        placeholder="搜索菜名或关键词"
        clearable
        @update:model-value="value => emit('update:keyword', value)"
      />

      <el-select
        :model-value="sortBy"
        placeholder="排序方式"
        @update:model-value="value => emit('update:sortBy', value)"
      >
        <el-option label="默认排序" value="default" />
        <el-option label="评分优先" value="rating" />
        <el-option label="价格从低到高" value="priceAsc" />
        <el-option label="价格从高到低" value="priceDesc" />
        <el-option label="销量优先" value="sales" />
      </el-select>

      <el-button @click="emit('reset')">重置</el-button>
    </div>

    <div class="dish-filter__tags">
      <button
        v-for="tag in tagOptions"
        :key="tag"
        class="dish-filter__tag"
        :class="{ 'is-active': activeTag === tag }"
        type="button"
        @click="emit('update:activeTag', tag)"
      >
        {{ tag === 'all' ? '全部标签' : tag }}
      </button>
    </div>
  </section>
</template>

<script setup>
defineOptions({
  name: 'DishFilterBar',
});

const props = defineProps({
  keyword: {
    type: String,
    default: '',
  },
  sortBy: {
    type: String,
    default: 'default',
  },
  activeTag: {
    type: String,
    default: 'all',
  },
  tagOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'update:keyword',
  'update:sortBy',
  'update:activeTag',
  'reset',
]);
</script>

<style scoped lang="scss">
.dish-filter {
  border: 1px solid var(--ft-color-border);
  border-radius: var(--ft-radius-md);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
  padding: var(--ft-space-2);
}

.dish-filter__main {
  display: grid;
  grid-template-columns: 1fr 220px 92px;
  gap: 12px;
}

.dish-filter__tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish-filter__tag {
  border: 1px solid var(--ft-color-border);
  background: var(--ft-color-bg-soft);
  color: var(--ft-color-text-muted);
  border-radius: var(--ft-radius-pill);
  padding: 6px 12px;
  font-size: var(--ft-font-size-sm);
  cursor: pointer;
  transition: all var(--ft-transition-fast);

  &:hover {
    color: var(--ft-color-primary);
    border-color: var(--ft-color-primary-soft);
  }

  &.is-active {
    color: #fff;
    border-color: transparent;
    background: linear-gradient(
      140deg,
      var(--ft-color-primary),
      var(--ft-color-primary-soft)
    );
  }
}

@media (max-width: 768px) {
  .dish-filter__main {
    grid-template-columns: 1fr;
  }
}
</style>
