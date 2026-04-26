<!-- @author Codex -->

<template>
  <div class="home-view" data-test="home-view">
    <HomeHero
      @recommend="scrollToSection('recommend')"
      @review="goReviewPage"
    />
    <div class="home-view__decor-bridge home-view__decor-bridge--hero" aria-hidden="true"></div>

    <section id="recommend" class="home-view__section home-view__section--recommend">
      <TodayRecommendationCarousel :items="recommendations" />
    </section>
    <div class="home-view__decor-bridge home-view__decor-bridge--recommend" aria-hidden="true"></div>

    <section id="canteens" class="home-view__section home-view__section--canteens">
      <CanteenCarousel :items="canteenSpots" @select="handleSelectCanteen" />
    </section>
    <div class="home-view__decor-bridge home-view__decor-bridge--canteens" aria-hidden="true"></div>

    <section id="ranking" class="home-view__section home-view__section--ranking">
      <HomeRankingList :rankings="rankings" />
    </section>
    <div class="home-view__decor-bridge home-view__decor-bridge--ranking" aria-hidden="true"></div>

    <section id="canteen-detail" class="home-view__section home-view__section--canteen-detail">
      <CanteenIntroGrid :canteens="canteens" />
    </section>
    <div class="home-view__decor-bridge home-view__decor-bridge--detail" aria-hidden="true"></div>

    <section id="message" class="home-view__section home-view__notice torn-edge">
      <h2>04 / 消息与吐槽墙</h2>
      <p class="dropcap">
        后续会接入“今日翻车播报”和“打饭成功率”实时投稿区。现在先保留入口位，
        保证导航结构稳定，避免你收藏的页面链接失效。
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CanteenCarousel from '../../components/home/CanteenCarousel.vue';
import CanteenIntroGrid from '../../components/home/CanteenIntroGrid.vue';
import HomeHero from '../../components/home/HomeHero.vue';
import HomeRankingList from '../../components/home/HomeRankingList.vue';
import TodayRecommendationCarousel from '../../components/home/TodayRecommendationCarousel.vue';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useDishStore } from '../../store/useDishStore';

defineOptions({
  name: 'HomeView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();

const canteens = computed(() => canteenStore.canteens);
const canteenSpots = computed(() => canteenStore.homeCanteenSpots);
const recommendations = computed(() => dishStore.homeRecommendations);
const rankings = computed(() =>
  canteenStore.rankings.map(item => ({
    ...item,
    canteenName: canteenStore.getCanteenById(item.canteenId)?.name ?? '未知食堂',
    image: dishStore.getDishById(item.dishId)?.image ?? '',
    price: dishStore.getDishById(item.dishId)?.price ?? 0,
    valueNote: dishStore.getDishById(item.dishId)?.valueNote ?? '性价比待补充',
    comment: dishStore.getDishById(item.dishId)?.comment ?? '同学评价待补充',
  }))
);

function handleSelectCanteen(canteenId) {
  canteenStore.setActiveCanteen(canteenId);
}

function goReviewPage() {
  router.push({ name: 'reviewCreate' });
}

function scrollToSection(sectionName) {
  const targetMap = {
    canteen: 'canteens',
    canteens: 'canteens',
    recommend: 'recommend',
    review: 'ranking',
    message: 'message',
    ranking: 'ranking',
  };
  const targetId = targetMap[sectionName];
  if (!targetId) {
    return;
  }

  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - 110;
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}

watch(
  () => route.query.section,
  section => {
    if (typeof section === 'string') {
      nextTick(() => scrollToSection(section));
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.home-view {
  position: relative;
  display: grid;
  gap: 0;
  min-width: 0;
  max-width: 100%;
}

.home-view__section {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 10px;
  min-width: 0;
  max-width: 100%;
}

.home-view__decor-bridge {
  position: relative;
  z-index: 0;
  min-height: 34px;
  pointer-events: none;
  overflow: visible;
}

.home-view__decor-bridge::before,
.home-view__decor-bridge::after {
  content: '';
  position: absolute;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.home-view__decor-bridge--hero {
  min-height: 46px;
}

.home-view__decor-bridge--hero::before {
  width: 108px;
  height: 108px;
  left: clamp(18px, 8vw, 96px);
  top: -24px;
  background-image: var(--zine-decor-stamp-round);
  opacity: 0.24;
  transform: rotate(-12deg);
}

.home-view__decor-bridge--hero::after {
  width: 142px;
  height: 62px;
  right: clamp(26px, 10vw, 128px);
  top: 2px;
  background-image: var(--zine-decor-arrow);
  opacity: 0.32;
  transform: rotate(5deg);
}

.home-view__decor-bridge--recommend::before {
  width: 172px;
  height: 112px;
  right: clamp(20px, 12vw, 150px);
  top: -32px;
  background-image: var(--zine-decor-stamp-recommend);
  opacity: 0.2;
  transform: rotate(8deg);
}

.home-view__decor-bridge--recommend::after {
  width: 230px;
  height: 68px;
  left: clamp(24px, 13vw, 154px);
  top: -4px;
  background-image: var(--zine-decor-torn-edge);
  opacity: 0.2;
  transform: rotate(-2deg);
}

.home-view__decor-bridge--canteens::before {
  width: 158px;
  height: 112px;
  left: clamp(18px, 10vw, 118px);
  top: -28px;
  background-image: var(--zine-decor-stamp-premium);
  opacity: 0.18;
  transform: rotate(-8deg);
}

.home-view__decor-bridge--canteens::after {
  width: 112px;
  height: 88px;
  right: clamp(18px, 9vw, 110px);
  top: -18px;
  background-image: var(--zine-decor-wow);
  opacity: 0.28;
  transform: rotate(7deg);
}

.home-view__decor-bridge--ranking::before {
  width: 142px;
  height: 142px;
  right: clamp(24px, 12vw, 142px);
  top: -38px;
  background-image: var(--zine-decor-stamp-chinese);
  opacity: 0.18;
  transform: rotate(6deg);
}

.home-view__decor-bridge--ranking::after {
  width: 62px;
  height: 104px;
  left: clamp(22px, 7vw, 84px);
  top: -30px;
  background-image: var(--zine-decor-paper-clip);
  opacity: 0.34;
  transform: rotate(-10deg);
}

.home-view__decor-bridge--detail::before {
  width: 128px;
  height: 128px;
  left: clamp(24px, 12vw, 140px);
  top: -34px;
  background-image: var(--zine-decor-sticky-note-alt);
  opacity: 0.2;
  transform: rotate(6deg);
}

.home-view__decor-bridge--detail::after {
  width: 112px;
  height: 112px;
  right: clamp(24px, 10vw, 118px);
  top: -24px;
  background-image: var(--zine-decor-food-sketch-3);
  opacity: 0.28;
  transform: rotate(-7deg);
}

.home-view__notice {
  position: relative;
  z-index: 1;
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface-ink);
  padding: 14px 18px;

  h2 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 30px;
    font-weight: 900;
  }

  p {
    margin: 8px 0 0;
    color: var(--ft-color-secondary-soft);
  }
}

@media (max-width: 768px) {
  .home-view__decor-bridge {
    min-height: 18px;
  }

  .home-view__decor-bridge::before,
  .home-view__decor-bridge::after {
    display: none;
  }
}
</style>
