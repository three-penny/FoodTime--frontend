<template>
  <div class="home-view" data-test="home-view">
    <HomeHero @recommend="scrollToSection('recommend')" @review="scrollToSection('ranking')" />

    <section id="recommend" class="home-view__section">
      <TodayRecommendationCarousel :items="recommendations" />
    </section>

    <section id="canteens" class="home-view__section">
      <CanteenCarousel :canteens="canteens" @select="handleSelectCanteen" />
      <CanteenIntroGrid :canteens="canteens" />
    </section>

    <section id="ranking" class="home-view__section">
      <HomeRankingList :rankings="rankings" />
    </section>

    <section id="message" class="home-view__section home-view__notice">
      <h2>消息与点评</h2>
      <p>消息中心与点评流将于下一迭代接入，这里预留统一入口避免后续导航调整。</p>
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
const recommendations = computed(() => dishStore.homeRecommendations);
const rankings = computed(() =>
  canteenStore.rankings.map(item => ({
    ...item,
    canteenName: canteenStore.getCanteenById(item.canteenId)?.name ?? '未知食堂',
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

  const top = element.getBoundingClientRect().top + window.scrollY - 94;
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
  display: flex;
  flex-direction: column;
}

.home-view__section {
  margin-top: var(--ft-space-4);
}

.home-view__notice {
  margin-bottom: var(--ft-space-2);
  border-radius: var(--ft-radius-md);
  border: 1px dashed var(--ft-color-border);
  background: rgb(255 255 255 / 65%);
  padding: var(--ft-space-3);

  h2 {
    margin: 0;
    font-size: var(--ft-font-size-lg);
  }

  p {
    margin: 8px 0 0;
    color: var(--ft-color-text-muted);
    line-height: 1.7;
  }
}
</style>
