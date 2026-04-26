<template>
  <section class="recommend" data-test="today-recommend">
    <div class="section-rule">
      <span class="section-rule__index">01</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="recommend__header">
      <h2 class="section-title">今日推荐</h2>
      <p class="section-subtitle">先看分，再看评，再看你要不要冲。</p>
    </header>

    <div
      ref="trackRef"
      class="recommend__track"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="recommend-card torn-edge"
        :class="`recommend-card--${index % 3}`"
      >
        <img
          class="recommend-card__image"
          :class="imageFrameClass(index)"
          :src="item.image"
          :alt="`${item.name}菜品图`"
          loading="lazy"
        />

        <div class="recommend-card__content">
          <div class="recommend-card__line">
            <span class="recommend-card__canteen">{{ item.canteenName }}</span>
            <span class="stamp">{{ item.stamp ?? getStampByRating(item.rating) }}</span>
          </div>

          <h3 class="recommend-card__title">{{ item.name }}</h3>
          <p class="recommend-card__score">评分 {{ item.rating.toFixed(1) }}</p>
          <p class="recommend-card__comment handwrite">“{{ item.comment }}”</p>
          <p class="recommend-card__price">¥{{ item.price }} / {{ item.valueNote }}</p>

          <div class="recommend-card__tags">
            <span
              v-for="tag in item.tags"
              :key="`${item.id}-${tag}`"
              class="recommend-card__tag"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="recommend-card__actions">
            <button
              class="button-ink is-primary"
              type="button"
              :class="{ 'is-selected': voteMap[item.id]?.type === 'recommend' }"
              @click="vote(item.id, 'recommend')"
            >
              推荐 {{ voteMap[item.id]?.recommend ?? baseRecommend(item) }}
            </button>
            <button
              class="button-ink"
              type="button"
              :class="{ 'is-selected': voteMap[item.id]?.type === 'avoid' }"
              @click="vote(item.id, 'avoid')"
            >
              避雷 {{ voteMap[item.id]?.avoid ?? baseAvoid(item) }}
            </button>
            <button class="button-ink recommend-card__detail" type="button" @click="jumpToDish(item)">
              看详情
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'TodayRecommendationCarousel',
});

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();
const trackRef = ref(null);
const isPaused = ref(false);
const voteMap = reactive({});
let timer = null;

function getStampByRating(rating) {
  if (rating >= 4.7) {
    return '必吃';
  }
  if (rating >= 4.4) {
    return '再来';
  }
  return '踩雷';
}

function imageFrameClass(index) {
  const classList = ['is-hard-cut', 'is-polygon', 'is-polaroid'];
  return classList[index % classList.length];
}

function baseRecommend(item) {
  return Math.max(24, Math.round(item.monthlySales / 4));
}

function baseAvoid(item) {
  return Math.max(4, Math.round((5 - item.rating) * 18));
}

function vote(id, type) {
  if (!voteMap[id]) {
    const target = props.items.find(item => item.id === id);
    voteMap[id] = {
      type: null,
      recommend: target ? baseRecommend(target) : 0,
      avoid: target ? baseAvoid(target) : 0,
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

function jumpToDish(item) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: item.canteenId,
      dishId: item.id,
    },
  });
}

function startAutoSlide() {
  timer = window.setInterval(() => {
    if (isPaused.value) {
      return;
    }
    const track = trackRef.value;
    if (!track) {
      return;
    }

    const step = track.clientWidth * 0.82;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScrollLeft - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    track.scrollBy({ left: step, behavior: 'smooth' });
  }, 2800);
}

onMounted(() => {
  startAutoSlide();
});

onBeforeUnmount(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});
</script>

<style scoped lang="scss">
.recommend {
  margin-top: var(--ft-space-5);
}

.recommend__header {
  margin-bottom: var(--ft-space-2);
}

.recommend__track {
  --peek: clamp(72px, 14vw, 220px);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc(100% - var(--peek));
  gap: var(--ft-space-2);
  overflow-x: auto;
  padding-right: var(--peek);
  padding-bottom: 6px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.recommend-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 12px;
  display: grid;
  gap: 10px;
  min-height: 520px;
  scroll-snap-align: start;
}

.recommend-card--0 {
  transform: translateY(0);
}

.recommend-card--1 {
  transform: translateY(14px);
}

.recommend-card--2 {
  transform: translateY(-8px);
}

.recommend-card__image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.recommend-card__image.is-hard-cut {
  border: 1px solid var(--ft-color-secondary);
}

.recommend-card__image.is-polygon {
  clip-path: polygon(0 0, 97% 0, 100% 88%, 84% 100%, 3% 100%, 0 12%);
}

.recommend-card__image.is-polaroid {
  border: 8px solid #fff;
  border-bottom-width: 24px;
  box-shadow: 4px 4px 0 rgb(58 36 24 / 28%);
}

.recommend-card__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommend-card__canteen {
  font-size: var(--ft-font-size-sm);
  color: var(--ft-color-text-muted);
}

.recommend-card__title {
  margin: 0;
  font-family: var(--ft-font-family-title);
  font-size: 32px;
  font-weight: 900;
  line-height: 1.05;
}

.recommend-card__score {
  margin: 0;
  color: var(--ft-color-primary);
  font-family: var(--ft-font-family-title);
  font-size: 28px;
  font-weight: 900;
}

.recommend-card__comment {
  margin: 0;
  color: var(--ft-color-primary);
  font-size: 22px;
}

.recommend-card__price {
  margin: 0;
  color: var(--ft-color-secondary-soft);
  font-size: var(--ft-font-size-sm);
}

.recommend-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.recommend-card__tag {
  font-size: 12px;
  border: 1px dashed rgb(58 36 24 / 40%);
  padding: 3px 7px;
}

.recommend-card__actions {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.button-ink.is-selected {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--ft-color-secondary);
}

.recommend-card__detail {
  margin-left: auto;
}
</style>
