<script setup>
defineOptions({ name: 'DishFilterBar' });

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  filters: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:filters']);

function updateField(field, value) {
  emit('update:filters', {
    ...props.filters,
    [field]: value,
  });
}

function resetFilters() {
  emit('update:filters', {
    keyword: '',
    category: '全部',
    sortBy: 'salesDesc',
  });
}
</script>

<template>
  <section class="dish-filter-bar">
    <el-input
      :model-value="filters.keyword"
      clearable
      placeholder="搜菜名"
      @update:model-value="updateField('keyword', $event)"
    />

    <el-select
      :model-value="filters.category"
      @update:model-value="updateField('category', $event)"
    >
      <el-option label="全部" value="全部" />
      <el-option
        v-for="category in categories"
        :key="category"
        :label="category"
        :value="category"
      />
    </el-select>

    <el-select
      :model-value="filters.sortBy"
      @update:model-value="updateField('sortBy', $event)"
    >
      <el-option label="月售多" value="salesDesc" />
      <el-option label="评分高" value="ratingDesc" />
      <el-option label="价格低" value="priceAsc" />
    </el-select>

    <el-button @click="resetFilters">重置</el-button>
  </section>
</template>

<style scoped>
.dish-filter-bar {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-card);
  background: var(--ft-surface);
  box-shadow: var(--ft-shadow-soft);
}

@media (max-width: 920px) {
  .dish-filter-bar {
    grid-template-columns: 1fr;
  }
}
</style>
