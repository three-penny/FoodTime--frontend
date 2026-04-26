<template>
  <section class="ranking" data-test="home-ranking">
    <div class="section-rule">
      <span class="section-rule__index">03</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="ranking__header">
      <h2 class="section-title">本周热榜 TOP10</h2>
      <p class="section-subtitle">左边看分和评价，右边看图，决策更快。</p>
      <span class="sticker sticker--r3">学生实时票选</span>
    </header>

    <ol class="ranking__list">
      <li
        v-for="(item, index) in rankings"
        :key="item.rank"
        class="ranking__item torn-edge"
        :class="`is-rank-${item.rank <= 3 ? item.rank : 'other'}`"
      >
        <div class="ranking__left">
          <div class="ranking__line">
            <span class="ranking__index">{{ item.rank }}</span>
            <h3>{{ item.dishName }}</h3>
            <span class="stamp">{{ item.stamp }}</span>
          </div>

          <p class="ranking__score">评分 {{ item.score.toFixed(1) }}</p>
          <p class="ranking__meta">
            {{ item.canteenName }} · ¥{{ item.price }} / {{ item.valueNote }}
          </p>
          <p class="ranking__comment handwrite">“{{ item.comment }}”</p>

          <div class="ranking__actions">
            <button
              class="button-ink is-primary"
              type="button"
              :class="{ 'is-selected': voteMap[item.rank]?.type === 'recommend' }"
              @click="vote(item.rank, 'recommend', item.recommendVotes, item.avoidVotes)"
            >
              推荐 {{ voteMap[item.rank]?.recommend ?? item.recommendVotes }}
            </button>
            <button
              class="button-ink"
              type="button"
              :class="{ 'is-selected': voteMap[item.rank]?.type === 'avoid' }"
              @click="vote(item.rank, 'avoid', item.recommendVotes, item.avoidVotes)"
            >
              避雷 {{ voteMap[item.rank]?.avoid ?? item.avoidVotes }}
            </button>
          </div>
        </div>

        <img
          class="ranking__image"
          :class="index % 2 === 0 ? 'is-hard-cut' : 'is-polaroid'"
          :src="item.image"
          :alt="`${item.dishName}图片`"
          loading="lazy"
        />
      </li>
    </ol>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

defineOptions({
  name: 'HomeRankingList',
});

const props = defineProps({
  rankings: {
    type: Array,
    default: () => [],
  },
});

const voteMap = reactive({});

function vote(id, type, baseRecommend, baseAvoid) {
  if (!voteMap[id]) {
    voteMap[id] = {
      type: null,
      recommend: baseRecommend,
      avoid: baseAvoid,
    };
  }

  const current = voteMap[id];
  if (current.type === type) {
    return;
  }

  if (current.type === 'recommend') {
    current.recommend -= 1;
  }
  if (current.type === 'avoid') {
    current.avoid -= 1;
  }
  if (type === 'recommend') {
    current.recommend += 1;
  } else {
    current.avoid += 1;
  }
  current.type = type;
}
</script>

<style scoped lang="scss">
.ranking {
  margin-top: var(--ft-space-5);
}

.ranking__header {
  margin-bottom: var(--ft-space-2);
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.ranking__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.ranking__item {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  padding: 10px;
}

.ranking__left {
  display: grid;
  gap: 6px;
}

.ranking__line {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;

  h3 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 32px;
    line-height: 1;
  }
}

.ranking__index {
  width: 44px;
  height: 44px;
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface-ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ft-font-family-title);
  font-size: 22px;
  font-weight: 900;
}

.ranking__score {
  margin: 0;
  color: var(--ft-color-primary);
  font-family: var(--ft-font-family-title);
  font-size: 30px;
  font-weight: 900;
}

.ranking__meta {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.ranking__comment {
  margin: 0;
  color: var(--ft-color-primary);
  font-size: 22px;
}

.ranking__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ranking__image {
  width: 100%;
  height: 164px;
  object-fit: cover;
  align-self: stretch;
}

.ranking__image.is-hard-cut {
  border: 1px solid var(--ft-color-secondary);
}

.ranking__image.is-polaroid {
  border: 7px solid #fff;
  border-bottom-width: 20px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 30%);
}

.button-ink.is-selected {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--ft-color-secondary);
}

.ranking__item.is-rank-1 {
  transform: rotate(-0.4deg);
}

.ranking__item.is-rank-2 {
  transform: rotate(0.6deg);
}

.ranking__item.is-rank-3 {
  transform: rotate(-0.3deg);
}

@media (max-width: 900px) {
  .ranking__item {
    grid-template-columns: 1fr;
  }

  .ranking__image {
    height: 210px;
  }
}
</style>
