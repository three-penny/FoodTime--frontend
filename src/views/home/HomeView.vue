<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ScoreLine from '../../components/print/ScoreLine.vue';
import {
  getCanteenBrickList,
  getDailyMenu,
  getErrataNotes,
  getMonthlyRanking,
  issueInfo,
} from '../../constants/mock/foodData';

defineOptions({ name: 'HomeView' });

const router = useRouter();

const featureDishes = computed(() => getDailyMenu(3));
const diaryCanteens = computed(() => getCanteenBrickList(6));
const hotRanking = computed(() => getMonthlyRanking(8));
const errataList = computed(() => getErrataNotes(4));

function jumpTo(id) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goCanteenDetail(canteenId) {
  router.push({ name: 'canteenDetail', params: { canteenId } });
}

function goDishDetail(dish) {
  router.push({
    name: 'dishDetail',
    params: { canteenId: dish.canteenId, dishId: dish.id },
  });
}

function getRatingTag(level) {
  if (level === '必吃') {
    return '必吃';
  }

  if (level === '踩雷') {
    return '踩雷';
  }

  return '再来';
}

function getRatingClass(level) {
  if (level === '必吃') {
    return 'is-must';
  }

  if (level === '踩雷') {
    return 'is-bad';
  }

  return 'is-again';
}

function getDishValueLine(dish) {
  return `¥${dish.price} / ${dish.valueNote || '吃到撑'}`;
}

function getCanteenValueLine(canteen) {
  return `¥${canteen.averagePrice} / ${canteen.bestFor || '吃到撑'}`;
}

function getFeatureMediaClass(index) {
  const classes = ['media-hard-cut', 'media-polygon', 'media-polaroid'];
  return classes[index % classes.length];
}

function getDiaryMediaClass(index) {
  const classes = ['media-polygon', 'media-hard-cut', 'media-polaroid'];
  return classes[index % classes.length];
}

function formatRankNo(index) {
  return String(index + 1).padStart(2, '0');
}
</script>

<template>
  <div class="canteen-zine">
    <header id="top" class="zine-hero torn-edge torn-edge--bottom">
      <p class="zine-hero__issue">
        {{ issueInfo.issueNo }} · {{ issueInfo.season }} · BJTU DINING FIELD
        NOTE
      </p>

      <div class="zine-hero__title-row">
        <h1 class="zine-hero__title">北交干饭吧</h1>
        <p class="zine-hero__slogan">{{ issueInfo.slogan }}</p>
      </div>

      <div class="zine-hero__tags">
        <span class="sticker-note rotate-left-2">今日推荐</span>
        <span class="sticker-note rotate-right-2">排队实测</span>
        <span class="sticker-note rotate-right-1">宿舍党友好</span>
      </div>

      <nav class="zine-hero__nav" aria-label="首页分区导航">
        <button type="button" @click="jumpTo('feature-dishes')">
          01 今日主菜
        </button>
        <button type="button" @click="jumpTo('canteen-diary')">
          02 食堂日记
        </button>
        <button type="button" @click="jumpTo('hot-ranking')">03 热门榜</button>
        <button type="button" @click="jumpTo('errata-board')">04 勘误板</button>
      </nav>

      <svg class="doodle doodle--soy" viewBox="0 0 120 120" aria-hidden="true">
        <path d="M46 12h28l8 22v62H38V34z" />
        <path d="M46 24h28" />
        <path d="M46 54h28" />
      </svg>
      <svg
        class="doodle doodle--chopsticks"
        viewBox="0 0 180 40"
        aria-hidden="true"
      >
        <path d="M6 10h160" />
        <path d="M12 28h160" />
      </svg>
      <svg
        class="doodle doodle--auntie"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="26" r="16" />
        <path d="M34 74c5-17 13-24 26-24s21 7 26 24" />
        <path d="M30 96h60" />
      </svg>
    </header>

    <section id="feature-dishes" class="zine-section">
      <header class="section-head">
        <span class="section-head__no">01</span>
        <h2 class="section-head__title">今日主菜专栏</h2>
      </header>

      <article
        v-for="(dish, index) in featureDishes"
        :key="dish.id"
        class="feature-story torn-edge torn-edge--side"
      >
        <figure
          class="feature-story__media"
          :class="getFeatureMediaClass(index)"
        >
          <img :src="dish.image" :alt="dish.imageAlt" />
          <figcaption>{{ dish.imageCaption }}</figcaption>
          <span class="sticker-note rotate-right-3">手写菜单牌同款</span>
        </figure>

        <div class="feature-story__main">
          <div class="feature-story__title-row">
            <h3>{{ dish.name }}</h3>
            <p class="value-line">{{ getDishValueLine(dish) }}</p>
          </div>

          <div class="feature-story__columns">
            <p class="dropcap">{{ dish.brief }}</p>
            <p>{{ dish.review }}</p>
          </div>

          <div class="feature-story__meta">
            <p class="handwriting-note">学生吐槽：{{ dish.shortQuotes[0] }}</p>
            <div class="rating-pack">
              <ScoreLine :score="dish.rating" align="left" />
              <span
                class="square-stamp"
                :class="getRatingClass(dish.ratingLevel)"
              >
                {{ getRatingTag(dish.ratingLevel) }}
              </span>
            </div>
          </div>

          <button type="button" class="entry-link" @click="goDishDetail(dish)">
            查看单品档案 →
          </button>
        </div>
      </article>
    </section>

    <section id="canteen-diary" class="zine-section">
      <header class="section-head">
        <span class="section-head__no">02</span>
        <h2 class="section-head__title">食堂打卡日记</h2>
      </header>

      <article
        v-for="(canteen, index) in diaryCanteens"
        :key="canteen.id"
        class="canteen-entry torn-edge torn-edge--top"
        :class="{ 'is-reverse': index % 2 === 1 }"
      >
        <figure class="canteen-entry__media" :class="getDiaryMediaClass(index)">
          <img :src="canteen.image" :alt="canteen.imageAlt" />
          <figcaption>{{ canteen.imageCaption }}</figcaption>
        </figure>

        <div class="canteen-entry__main">
          <div class="canteen-entry__title-row">
            <h3>{{ canteen.name }}</h3>
            <p class="value-line">{{ getCanteenValueLine(canteen) }}</p>
          </div>

          <p class="canteen-entry__facts">
            {{ canteen.location }} · 营业 {{ canteen.businessHours }} · 步行
            {{ canteen.walkMinutes }} 分钟
          </p>

          <p class="handwriting-note">学生吐槽：{{ canteen.note }}</p>

          <div class="canteen-entry__rating-row">
            <ScoreLine :score="canteen.rating" align="left" />
            <span
              class="square-stamp"
              :class="getRatingClass(canteen.ratingLevel)"
            >
              {{ getRatingTag(canteen.ratingLevel) }}
            </span>
            <span class="sticker-note rotate-left-1"
              >窗口热度 {{ canteen.queueCount }}</span
            >
          </div>

          <ul class="canteen-entry__dish-list">
            <li
              v-for="dishName in canteen.mustOrder.slice(0, 2)"
              :key="dishName"
            >
              {{ dishName }}
            </li>
          </ul>

          <button
            type="button"
            class="entry-link"
            @click="goCanteenDetail(canteen.id)"
          >
            去看完整食堂档案 →
          </button>
        </div>
      </article>
    </section>

    <section id="hot-ranking" class="zine-section">
      <header class="section-head">
        <span class="section-head__no">03</span>
        <h2 class="section-head__title">本周热门榜</h2>
      </header>

      <div class="ranking-board">
        <ol class="ranking-list">
          <li
            v-for="(item, index) in hotRanking"
            :key="item.id"
            class="ranking-item torn-edge torn-edge--bottom"
          >
            <strong class="ranking-item__no">{{ formatRankNo(index) }}</strong>
            <div class="ranking-item__main">
              <h3>
                {{ item.name }}
                <small>{{ item.canteenName }}</small>
              </h3>
              <p class="value-line">
                ¥{{ item.price }} / {{ item.valueNote || '吃到撑' }}
              </p>
              <p class="handwriting-note">
                学生吐槽：{{ item.shortQuotes[0] }}
              </p>
            </div>
            <div class="ranking-item__rating">
              <ScoreLine :score="item.rating" />
              <span
                class="square-stamp"
                :class="getRatingClass(item.ratingLevel)"
              >
                {{ getRatingTag(item.ratingLevel) }}
              </span>
            </div>
          </li>
        </ol>

        <aside class="ranking-board__legend torn-edge torn-edge--side">
          <h3>评分印章</h3>
          <p>数字评分看稳定，印章看情绪。</p>
          <div class="legend-row">
            <span class="square-stamp is-must">必吃</span>
            <span class="square-stamp is-again">再来</span>
            <span class="square-stamp is-bad">踩雷</span>
          </div>
          <p class="handwriting-note">“周三的红烧肉别错过。”</p>
        </aside>
      </div>
    </section>

    <section id="errata-board" class="zine-section">
      <header class="section-head">
        <span class="section-head__no">04</span>
        <h2 class="section-head__title">勘误与补充</h2>
      </header>

      <div class="errata-board torn-edge torn-edge--top">
        <p v-for="text in errataList" :key="text">{{ text }}</p>
      </div>
    </section>

    <footer class="zine-footer">
      <p>{{ issueInfo.colophon }}</p>
    </footer>
  </div>
</template>

<style scoped>
.canteen-zine {
  width: min(1240px, calc(100vw - 28px));
  margin: 0 auto;
  padding: 24px 0 42px;
  color: var(--ft-ink);
}

.zine-hero {
  position: relative;
  display: grid;
  gap: 18px;
  border: 1px solid var(--ft-ink);
  padding: 20px 20px 26px;
  background: var(--ft-paper-soft);
  overflow: hidden;
}

.zine-hero__issue {
  margin: 0;
  letter-spacing: 0.06em;
  font-size: 12px;
  font-weight: 700;
}

.zine-hero__title-row {
  display: grid;
  gap: 14px;
}

.zine-hero__title {
  margin: 0;
  max-width: 52vw;
  font-size: clamp(64px, 16vw, 180px);
  line-height: 0.88;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: var(--ft-red);
  transform: scaleX(0.9) scaleY(1.06);
}

.zine-hero__slogan {
  margin: 0;
  max-width: 280px;
  padding-left: 14px;
  border-left: 2px solid var(--ft-ink);
  font-size: 15px;
  line-height: 1.7;
}

.zine-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.zine-hero__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}

.zine-hero__nav button {
  border: 1px solid var(--ft-ink);
  padding: 6px 10px;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.zine-hero__nav button:hover {
  color: var(--ft-paper);
  border-color: var(--ft-red);
  background: var(--ft-red);
}

.doodle {
  position: absolute;
  fill: none;
  stroke: var(--ft-ink);
  stroke-width: 2;
  opacity: 0.5;
  pointer-events: none;
}

.doodle--soy {
  right: 24px;
  top: 22px;
  width: 52px;
}

.doodle--chopsticks {
  right: 16px;
  bottom: 16px;
  width: 116px;
}

.doodle--auntie {
  left: 24px;
  bottom: 20px;
  width: 62px;
}

.zine-section {
  margin-top: 36px;
}

.section-head {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ft-ink);
}

.section-head__no {
  font-family: var(--ft-mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--ft-red);
}

.section-head__title {
  margin: 0;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.feature-story {
  display: grid;
  gap: 16px;
  border: 1px solid var(--ft-ink);
  margin-top: 16px;
  padding: 14px;
  background: var(--ft-paper);
}

.feature-story__media {
  position: relative;
}

.feature-story__media img {
  width: 100%;
  height: clamp(220px, 32vw, 340px);
  object-fit: cover;
}

.feature-story__media figcaption {
  margin-top: 8px;
  font-size: 12px;
}

.feature-story__main {
  display: grid;
  gap: 12px;
}

.feature-story__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 14px;
}

.feature-story__title-row h3 {
  margin: 0;
  font-size: clamp(32px, 4.2vw, 48px);
  font-weight: 900;
  line-height: 0.94;
}

.feature-story__columns {
  columns: 2;
  column-gap: 22px;
}

.feature-story__columns p {
  margin: 0 0 10px;
  break-inside: avoid;
  line-height: 1.8;
  font-size: 14px;
}

.dropcap::first-letter {
  float: left;
  margin-right: 6px;
  font-family: var(--ft-serif);
  font-size: 46px;
  font-weight: 900;
  color: var(--ft-red);
  line-height: 0.9;
}

.feature-story__meta {
  display: grid;
  gap: 8px;
}

.rating-pack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.entry-link {
  width: fit-content;
  border: 1px solid var(--ft-ink);
  padding: 6px 10px;
  background: transparent;
  font-weight: 700;
}

.entry-link:hover {
  color: var(--ft-paper);
  border-color: var(--ft-red);
  background: var(--ft-red);
}

.canteen-entry {
  display: grid;
  gap: 14px;
  border: 1px solid var(--ft-ink);
  margin-top: 14px;
  padding: 14px;
  background: var(--ft-paper-soft);
}

.canteen-entry__media {
  position: relative;
}

.canteen-entry__media img {
  width: 100%;
  height: clamp(220px, 28vw, 320px);
  object-fit: cover;
}

.canteen-entry__media figcaption {
  margin-top: 7px;
  font-size: 12px;
}

.canteen-entry__main {
  display: grid;
  gap: 10px;
  align-content: start;
}

.canteen-entry__title-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px 14px;
}

.canteen-entry__title-row h3 {
  margin: 0;
  font-size: clamp(34px, 4.6vw, 54px);
  line-height: 0.92;
  font-weight: 900;
}

.canteen-entry__facts {
  margin: 0;
  font-size: 13px;
}

.canteen-entry__rating-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.canteen-entry__dish-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 4px;
  font-size: 13px;
}

.ranking-board {
  display: grid;
  gap: 14px;
}

.ranking-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.ranking-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 8px 12px;
  border: 1px solid var(--ft-ink);
  padding: 10px 12px;
  background: var(--ft-paper);
}

.ranking-item__no {
  font-family: var(--ft-serif);
  color: var(--ft-red);
  font-size: 34px;
  line-height: 1;
}

.ranking-item__main h3 {
  margin: 0;
  font-size: 21px;
  line-height: 1.1;
}

.ranking-item__main h3 small {
  margin-left: 8px;
  font-family: var(--ft-sans);
  font-size: 12px;
  font-weight: 700;
}

.ranking-item__rating {
  display: grid;
  gap: 6px;
  justify-items: end;
}

.ranking-board__legend {
  border: 1px solid var(--ft-ink);
  padding: 12px;
  background: var(--ft-paper-soft);
}

.ranking-board__legend h3 {
  margin: 0 0 8px;
  font-size: 26px;
  line-height: 0.95;
}

.ranking-board__legend p {
  margin: 0 0 8px;
  font-size: 13px;
}

.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 10px;
}

.errata-board {
  border: 1px solid var(--ft-ink);
  padding: 12px;
  background: var(--ft-paper-soft);
  display: grid;
  gap: 6px;
}

.errata-board p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.zine-footer {
  margin-top: 22px;
  padding-top: 12px;
  border-top: 1px solid var(--ft-ink);
}

.zine-footer p {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.02em;
}

.value-line {
  margin: 0;
  font-family: var(--ft-mono);
  font-size: 14px;
  color: var(--ft-ink);
}

.handwriting-note {
  margin: 0;
  font-family: var(--ft-handwriting);
  font-size: 25px;
  line-height: 1.3;
  color: var(--ft-red);
}

.sticker-note {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--ft-ink);
  padding: 3px 8px;
  background: var(--ft-paper);
  font-size: 12px;
  font-weight: 700;
}

.square-stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 34px;
  border: 1px solid var(--ft-red);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.03em;
}

.square-stamp.is-must {
  color: var(--ft-paper);
  background: var(--ft-red);
}

.square-stamp.is-again {
  color: var(--ft-red);
  background: transparent;
}

.square-stamp.is-bad {
  color: var(--ft-paper);
  border-color: var(--ft-ink);
  background: var(--ft-ink);
}

.rotate-left-2 {
  transform: rotate(-2deg);
}

.rotate-left-1 {
  transform: rotate(-1deg);
}

.rotate-right-1 {
  transform: rotate(1deg);
}

.rotate-right-2 {
  transform: rotate(2deg);
}

.rotate-right-3 {
  transform: rotate(3deg);
}

.media-hard-cut {
  border: 1px solid var(--ft-ink);
}

.media-polygon {
  border: 1px solid var(--ft-ink);
  clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);
}

.media-polaroid {
  border: 1px solid var(--ft-ink);
  padding: 8px 8px 18px;
  background: var(--ft-paper);
  transform: rotate(-2deg);
}

.torn-edge {
  position: relative;
}

.torn-edge--bottom {
  clip-path: polygon(
    0 0,
    100% 0,
    100% 92%,
    94% 100%,
    86% 94%,
    76% 100%,
    66% 94%,
    56% 100%,
    44% 94%,
    34% 100%,
    24% 94%,
    14% 100%,
    0 94%
  );
}

.torn-edge--top {
  clip-path: polygon(
    0 7%,
    10% 0,
    20% 6%,
    30% 0,
    40% 6%,
    50% 0,
    60% 6%,
    70% 0,
    80% 6%,
    90% 0,
    100% 7%,
    100% 100%,
    0 100%
  );
}

.torn-edge--side {
  clip-path: polygon(
    0 0,
    97% 0,
    100% 9%,
    96% 18%,
    100% 27%,
    96% 36%,
    100% 45%,
    96% 54%,
    100% 63%,
    96% 72%,
    100% 81%,
    96% 90%,
    100% 100%,
    0 100%
  );
}

@media (min-width: 960px) {
  .zine-hero__title-row {
    grid-template-columns: 2.2fr 1fr;
    align-items: end;
    gap: 20px;
  }

  .feature-story {
    grid-template-columns: 1fr 2fr;
    align-items: start;
  }

  .feature-story:nth-of-type(even) {
    grid-template-columns: 2fr 1fr;
  }

  .feature-story:nth-of-type(even) .feature-story__media {
    order: 2;
  }

  .canteen-entry {
    grid-template-columns: 1fr 2fr;
    align-items: start;
  }

  .canteen-entry.is-reverse {
    grid-template-columns: 2fr 1fr;
  }

  .canteen-entry.is-reverse .canteen-entry__media {
    order: 2;
  }

  .ranking-board {
    grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
    align-items: start;
  }
}

@media (max-width: 959px) {
  .canteen-zine {
    width: min(1240px, calc(100vw - 16px));
    padding: 16px 0 30px;
  }

  .zine-hero__title {
    max-width: none;
    font-size: clamp(58px, 21vw, 128px);
  }

  .feature-story__columns {
    columns: 1;
  }

  .handwriting-note {
    font-size: 22px;
  }

  .doodle--auntie {
    display: none;
  }
}
</style>
