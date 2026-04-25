<template>
  <section class="ranking" data-test="home-ranking">
    <header class="ranking__header">
      <h2 class="section-title">本周热榜</h2>
      <p class="section-subtitle">Top 1/2/3 高亮，快速锁定本周被重复点单最多的菜。</p>
    </header>

    <ol class="ranking__list">
      <li
        v-for="item in rankings"
        :key="item.rank"
        class="ranking__item"
        :class="`is-rank-${item.rank <= 3 ? item.rank : 'other'}`"
      >
        <span class="ranking__index">{{ item.rank }}</span>
        <div class="ranking__info">
          <h3>{{ item.dishName }}</h3>
          <p>{{ item.canteenName }}</p>
        </div>
        <span class="ranking__score">{{ item.score.toFixed(1) }}</span>
      </li>
    </ol>
  </section>
</template>

<script setup>
defineOptions({
  name: 'HomeRankingList',
});

const props = defineProps({
  rankings: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped lang="scss">
.ranking {
  margin-top: var(--ft-space-5);
}

.ranking__header {
  margin-bottom: var(--ft-space-2);
}

.ranking__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.ranking__item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-radius: var(--ft-radius-md);
  border: 1px solid var(--ft-color-border);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
}

.ranking__index {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  background: var(--ft-color-text-muted);
}

.ranking__info {
  flex: 1;

  h3 {
    margin: 0;
    font-size: var(--ft-font-size-md);
  }

  p {
    margin: 2px 0 0;
    color: var(--ft-color-text-muted);
    font-size: var(--ft-font-size-sm);
  }
}

.ranking__score {
  font-weight: 700;
  color: var(--ft-color-secondary);
}

.ranking__item.is-rank-1 .ranking__index {
  background: linear-gradient(140deg, #f6ad55, #dd6b20);
}

.ranking__item.is-rank-2 .ranking__index {
  background: linear-gradient(140deg, #cbd5e0, #718096);
}

.ranking__item.is-rank-3 .ranking__index {
  background: linear-gradient(140deg, #d69e2e, #975a16);
}
</style>
