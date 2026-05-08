<template>
  <section class="dish-filter torn-edge">
    <div class="dish-filter__main">
      <label class="dish-filter__control">
        <span>搜索</span>
        <input
          :value="keyword"
          type="text"
          placeholder="输入菜名或关键词"
          @input="event => emit('update:keyword', event.target.value)"
        />
      </label>

      <label class="dish-filter__control">
        <span>排序</span>
        <select
          :value="sortBy"
          @change="event => emit('update:sortBy', event.target.value)"
        >
          <option value="default">默认排序</option>
          <option value="rating">评分优先</option>
          <option value="priceAsc">价格从低到高</option>
          <option value="priceDesc">价格从高到低</option>
          <option value="sales">销量优先</option>
        </select>
      </label>

      <button class="button-ink" type="button" @click="emit('reset')">清空筛选</button>
    </div>

    <div class="dish-filter__tags">
      <button
        v-for="(tag, index) in tagOptions"
        :key="tag"
        class="dish-filter__tag"
        :class="{
          'is-active': activeTag === tag,
          'is-tilt': index % 2 === 0,
        }"
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
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 14px;
}

.dish-filter__main {
  display: grid;
  grid-template-columns: 1fr 220px auto;
  gap: 10px;
  align-items: end;
}

.dish-filter__control {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 13px;

  input,
  select {
    border: 1px solid var(--ft-color-secondary);
    background: #faf8f2;
    min-height: 40px;
    padding: 0 10px;
    font: inherit;
    color: var(--ft-color-secondary);
    outline: none;
  }
}

.dish-filter__tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish-filter__tag {
  border: 1px solid var(--ft-color-secondary);
  background: #f7f3e9;
  color: var(--ft-color-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 5px 10px;
}

.dish-filter__tag.is-active {
  background: var(--ft-color-primary);
  color: #fff6f2;
}

.dish-filter__tag.is-tilt {
  transform: rotate(-1deg);
}

@media (max-width: 900px) {
  .dish-filter__main {
    grid-template-columns: 1fr;
  }
}
</style>
