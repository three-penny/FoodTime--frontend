<!-- @author XXXXX -->

<template>
  <section class="ranking" data-test="home-ranking">
    <div class="section-rule">
      <span class="section-rule__index">03</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="ranking__header">
      <div>
        <h2 class="section-title">本周热榜 TOP10</h2>
        <p class="section-subtitle">左边看分和评价，右边看图，决策更快。</p>
      </div>
      <span class="sticker sticker--r3">学生实时票选</span>
    </header>

    <p v-if="voteMessage" class="ranking__message">{{ voteMessage }}</p>
    <ol class="ranking__list">
      <li
        v-for="(item, index) in rankings"
        :key="item.rank"
        class="ranking__item"
        :class="[`is-rank-${item.rank <= 3 ? item.rank : 'other'}`, `is-tilt-${index % 4}`]"
      >
        <span class="ranking__clip" aria-hidden="true"></span>

        <div class="ranking__index-wrap">
          <span class="ranking__index">{{ rankNumber(item.rank) }}</span>
        </div>

        <div class="ranking__body">
          <div class="ranking__line">
            <h3>{{ item.dishName }}</h3>
            <span class="stamp">{{ getRatingLabel(item.score) }}</span>
          </div>

          <div class="ranking__score-line">
            <span class="zine-rating-stamp">{{ (item.score ?? 0).toFixed(1) }}</span>
            <span class="ranking__votes handwrite">
              （× {{ voteCount(item, 'recommend') }} 人推荐）
            </span>
          </div>

          <p class="ranking__meta">
            {{ item.canteenName }} · {{ item.valueNote }}
            <template v-if="Number.isFinite(Number(item.price)) && Number(item.price) > 0">
              · ¥{{ item.price }}
            </template>
          </p>
          <p class="ranking__comment handwrite">
            “{{ formatComment(item.comment, 30).text }}”
            <span class="ranking__count">（{{ formatComment(item.comment, 30).length }}字）</span>
          </p>

          <div class="ranking__actions">
            <button
              class="button-ink is-stamp-red"
              type="button"
              :disabled="Boolean(pendingVotes[item.dishId])"
              :class="{ 'is-selected': voteMap[item.dishId]?.type === 'recommend' }"
              @click="vote(item, 'recommend')"
            >
              推荐 {{ voteCount(item, 'recommend') }}
            </button>
            <button
              class="button-ink is-stamp-blue"
              type="button"
              :disabled="Boolean(pendingVotes[item.dishId])"
              :class="{ 'is-selected': voteMap[item.dishId]?.type === 'avoid' }"
              @click="vote(item, 'avoid')"
            >
              避雷 {{ voteCount(item, 'avoid') }}
            </button>
          </div>
        </div>

        <figure class="ranking__media">
          <img
            class="ranking__image"
            :src="item.image"
            :alt="`${item.dishName}图片`"
            loading="lazy"
          />
          <figcaption class="handwrite">{{ item.canteenName }}</figcaption>
        </figure>

        <span v-if="item.rank <= 3" class="ranking__badge">
          {{ badgeText(item.rank) }}
        </span>
      </li>
    </ol>
  </section>
</template>

<script setup>
/**
 * HomeRankingList
 * 职责：展示每周榜单，通过 useDishStore 将推荐和避雷投票提交到 API。
 * 输入：rankings 榜单条目，以 dishId 关联真实菜品和票数。
 * 注意：榜单接口的票数可能为占位值，优先展示菜品 store 加载的票数。
 */
import { reactive, ref } from 'vue';
import { useDishStore } from '../../store/useDishStore';
import { formatComment } from '../../utils/commentText';
import { getRatingLabel } from '../../utils/ratingLabel';

defineOptions({
  name: 'HomeRankingList',
});

defineProps({
  rankings: {
    type: Array,
    default: () => [],
  },
});

const dishStore = useDishStore();
const voteMap = reactive({});
const pendingVotes = reactive({});
const voteMessage = ref('');

function rankNumber(rank) {
  return String(rank).padStart(2, '0');
}

function badgeText(rank) {
  if (rank === 1) {
    return '🏆 NO.1 / 周冠军';
  }
  if (rank === 2) {
    return 'NO.2 / 亚军';
  }
  return 'NO.3 / 季军';
}

function voteCount(item, type) {
  const field = type === 'recommend' ? 'recommendVotes' : 'avoidVotes';
  return dishStore.getDishById(item.dishId)?.[field]
    ?? voteMap[item.dishId]?.[type]
    ?? item[field]
    ?? 0;
}

async function vote(item, type) {
  const id = item.dishId;
  if (!id || pendingVotes[id] || voteMap[id]?.type === type) return;
  pendingVotes[id] = true;
  voteMessage.value = '';
  const current = voteMap[id] ?? {
    recommend: voteCount(item, 'recommend'),
    avoid: voteCount(item, 'avoid'),
  };
  try {
    if (type === 'recommend') await dishStore.recommendDish(id);
    else await dishStore.avoidDish(id);
    // 两种接口各自累加票数，切换类型时不能撤销已写入服务端的票。
    current[type] += 1;
    current.type = type;
    voteMap[id] = current;
  } catch (e) {
    voteMessage.value = e.message || '投票失败，请稍后重试。';
  } finally {
    pendingVotes[id] = false;
  }
}

</script>

<style scoped lang="scss">
.ranking {
  margin-top: var(--ft-space-5);
  min-width: 0;
  max-width: 100%;
}

.ranking__header {
  margin-bottom: var(--ft-space-3);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ranking__list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 20px;
  min-width: 0;
}

.ranking__item {
  position: relative;
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: 18px 18px 18px 16px;
  box-shadow: 5px 6px 0 rgb(58 36 24 / 10%);
}

.ranking__item.is-tilt-0 {
  transform: rotate(-0.35deg);
}

.ranking__item.is-tilt-1 {
  transform: rotate(0.32deg);
}

.ranking__item.is-tilt-2 {
  transform: rotate(-0.18deg);
}

.ranking__item.is-tilt-3 {
  transform: rotate(0.24deg);
}

.ranking__item.is-rank-1 {
  border-color: rgb(184 137 36 / 70%);
  background: linear-gradient(96deg, rgb(244 223 151 / 38%), var(--zine-paper-card) 44%);
}

.ranking__item.is-rank-2 {
  border-color: rgb(142 150 157 / 70%);
  background: linear-gradient(96deg, rgb(230 230 223 / 58%), var(--zine-paper-card) 44%);
}

.ranking__item.is-rank-3 {
  border-color: rgb(176 106 54 / 70%);
  background: linear-gradient(96deg, rgb(237 210 181 / 52%), var(--zine-paper-card) 44%);
}

.ranking__clip {
  position: absolute;
  left: -14px;
  top: -16px;
  width: 36px;
  height: 78px;
  background: var(--zine-decor-paper-clip) center / contain no-repeat;
  opacity: 0.52;
  transform: rotate(-16deg);
  pointer-events: none;
  mix-blend-mode: multiply;
}

.ranking__item:nth-child(n + 6) .ranking__clip {
  display: none;
}

.ranking__index-wrap {
  align-self: stretch;
  display: grid;
  place-items: center;
}

.ranking__index {
  min-width: 76px;
  font-family: var(--zine-title-font);
  font-size: 58px;
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: 0;
  color: transparent;
  -webkit-text-stroke: 1.4px var(--ft-color-secondary);
  text-shadow: 3px 3px 0 rgb(58 36 24 / 10%);
}

.ranking__item.is-rank-1 .ranking__index {
  color: var(--zine-foil-gold);
  -webkit-text-stroke: 1px #6f4b12;
  filter: drop-shadow(2px 2px 0 rgb(95 63 14 / 26%));
}

.ranking__item.is-rank-2 .ranking__index {
  color: var(--zine-foil-silver);
  -webkit-text-stroke: 1px #606a72;
}

.ranking__item.is-rank-3 .ranking__index {
  color: var(--zine-foil-bronze);
  -webkit-text-stroke: 1px #743d1c;
}

.ranking__body {
  min-width: 0;
  display: grid;
  gap: 7px;
}

.ranking__line {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.ranking__line h3 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: 32px;
  line-height: 1;
}

.ranking__item.is-rank-1 .ranking__line h3,
.ranking__item.is-rank-2 .ranking__line h3,
.ranking__item.is-rank-3 .ranking__line h3 {
  font-size: 42px;
}

.ranking__score-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ranking__votes {
  color: var(--ft-color-text-muted);
  font-size: 20px;
}

.ranking__meta {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.ranking__comment {
  margin: 0;
  color: var(--zine-stamp-red);
  font-size: 22px;
  line-height: 1.25;
}

.ranking__count {
  color: var(--ft-color-text-muted);
  font-size: 15px;
}

.ranking__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ranking__media {
  margin: 0;
  width: calc(var(--zine-rank-image-width) + 16px);
  background: #fdfaf2;
  padding: 8px 8px 28px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
  transform: rotate(1.4deg);
}

.ranking__item:nth-child(even) .ranking__media {
  transform: rotate(-1deg);
}

.ranking__image {
  width: var(--zine-rank-image-width);
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid rgb(58 36 24 / 18%);
}

.ranking__media figcaption {
  position: absolute;
  right: 16px;
  bottom: 3px;
  color: var(--ft-color-text-muted);
  font-size: 18px;
}

.ranking__badge {
  position: absolute;
  right: 150px;
  top: -14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: rgb(255 250 240 / 76%);
  font-family: var(--zine-title-font);
  font-size: 14px;
  font-weight: 900;
  line-height: 1.18;
  text-align: center;
  transform: rotate(-6deg);
  mix-blend-mode: multiply;
  white-space: pre-wrap;
}

.ranking__item.is-rank-1 .ranking__badge {
  color: #946719;
  background: radial-gradient(circle, #fff5bd 0 48%, rgb(184 137 36 / 24%) 49% 100%);
}

.ranking__item.is-rank-2 .ranking__badge {
  color: #6b737a;
  background: radial-gradient(circle, #f7f7f1 0 48%, rgb(142 150 157 / 22%) 49% 100%);
}

.ranking__item.is-rank-3 .ranking__badge {
  color: #8b4f26;
  background: radial-gradient(circle, #fff0de 0 48%, rgb(176 106 54 / 23%) 49% 100%);
}

.button-ink.is-selected {
  transform: translate(-2px, -2px) rotate(-2deg);
  background: rgb(255 250 240 / 70%);
}

@media (max-width: 900px) {
  .ranking__item {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .ranking__media {
    grid-column: 1 / -1;
    width: min(100%, 260px);
  }

  .ranking__image {
    width: 100%;
  }

  .ranking__badge {
    right: 16px;
    top: 10px;
    width: 86px;
    height: 86px;
    font-size: 12px;
  }
}

@media (max-width: 520px) {
  .ranking__header {
    margin-bottom: 8px;
  }

  .ranking__list {
    gap: 10px;
  }

  .ranking__item {
    grid-template-columns: auto minmax(0, 1fr) 104px;
    gap: 10px;
    align-items: start;
    padding: 12px;
    box-shadow: var(--app-mobile-shadow);
    transform: none;
  }

  .ranking__index-wrap {
    justify-content: start;
    align-self: auto;
  }

  .ranking__index {
    min-width: 0;
    font-size: 24px;
    line-height: 1;
    -webkit-text-stroke-width: 1px;
    text-shadow: 1px 1px 0 rgb(58 36 24 / 8%);
  }

  .ranking__body {
    gap: 5px;
  }

  .ranking__item.is-rank-1 .ranking__line h3,
  .ranking__item.is-rank-2 .ranking__line h3,
  .ranking__item.is-rank-3 .ranking__line h3,
  .ranking__line h3 {
    font-size: 22px;
    line-height: 1.12;
  }

  .ranking__score-line {
    align-items: start;
    flex-wrap: wrap;
  }

  .ranking__votes {
    font-size: 14px;
  }

  .ranking__comment {
    font-size: 15px;
    line-height: 1.18;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .ranking__count {
    display: none;
  }

  .ranking__meta {
    font-size: 12px;
    line-height: 1.3;
  }

  .ranking__media {
    grid-column: 3;
    grid-row: 1;
    align-self: start;
    width: 104px;
    padding: 5px;
    transform: none;
    box-shadow: none;
  }

  .ranking__image {
    width: 100%;
    aspect-ratio: 1 / 1;
  }

  .ranking__item:nth-child(even) .ranking__media {
    transform: none;
  }

  .ranking__media figcaption {
    position: static;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.15;
    text-align: center;
  }

  .ranking__badge,
  .ranking__clip {
    display: none;
  }

  .ranking__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .ranking__actions .button-ink {
    min-height: 36px;
    padding: 7px 8px;
    font-size: 15px;
  }

  .ranking__score-line .zine-rating-stamp {
    width: 38px;
    height: 38px;
    font-size: 15px;
  }
}

@media (max-width: 380px) {
  .ranking__item {
    grid-template-columns: auto minmax(0, 1fr) 92px;
    gap: 8px;
  }

  .ranking__media {
    width: 92px;
  }
}
</style>
