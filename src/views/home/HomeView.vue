<template>
  <div class="home-view" data-test="home-view">
    <HomeHero
      @recommend="scrollToSection('recommend')"
      @review="scrollToSection('ranking')"
    />

    <section id="recommend" class="home-view__section">
      <div class="home-view__sticker-row">
        <span class="sticker sticker--r1">排队实测</span>
        <span class="sticker sticker--r-1">同学口碑</span>
      </div>
      <TodayRecommendationCarousel :items="recommendations" />
    </section>

    <section id="canteens" class="home-view__section">
      <div class="home-view__sticker-row home-view__sticker-row--right">
        <span class="sticker sticker--r2">午饭冲刺地图</span>
      </div>
      <CanteenCarousel :items="canteenSpots" @select="handleSelectCanteen" />
      <CanteenIntroGrid :canteens="canteens" />
    </section>

    <section id="ranking" class="home-view__section">
      <HomeRankingList :rankings="rankings" />
    </section>

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
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
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

function scrollToSection(sectionName) {
  const targetMap = {
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
      scrollToSection(section);
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.home-view {
  display: grid;
  gap: var(--ft-space-4);
}

.home-view__section {
  display: grid;
  gap: 10px;
}

.home-view__sticker-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.home-view__sticker-row--right {
  justify-content: flex-end;
}

.home-view__notice {
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
</style>
