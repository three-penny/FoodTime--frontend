<template>
  <section class="canteen-carousel" data-test="canteen-carousel">
    <div class="section-rule">
      <span class="section-rule__index">02</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="canteen-carousel__header">
      <h2 class="section-title">食堂选择</h2>
      <p class="section-subtitle">十条真实打卡位，评分和吐槽先给你看。</p>
    </header>

    <div
      ref="trackRef"
      class="canteen-carousel__track"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="canteen-card torn-edge"
        :class="`canteen-card--${index % 2}`"
      >
        <button class="canteen-card__entry" type="button" @click="handleSelect(item.canteenId)">
          <img
            class="canteen-card__image"
            :class="index % 2 === 0 ? 'is-hard-cut' : 'is-polaroid'"
            :src="item.image"
            :alt="`${item.name}食堂图`"
            loading="lazy"
          />
          <div class="canteen-card__content">
            <div class="canteen-card__title-line">
              <h3>{{ item.name }}</h3>
              <span class="stamp">{{ item.stamp }}</span>
            </div>

            <p class="canteen-card__score">评分 {{ item.rating.toFixed(1) }}</p>
            <p class="canteen-card__meta">¥{{ item.price }} / {{ item.valueNote }}</p>
            <p class="canteen-card__rant handwrite">“{{ item.comment }}”</p>
          </div>
        </button>

        <div class="canteen-card__actions">
          <button
            class="button-ink is-primary"
            type="button"
            :class="{ 'is-selected': voteMap[item.id]?.type === 'recommend' }"
            @click="vote(item.id, 'recommend', item.recommendVotes, item.avoidVotes)"
          >
            推荐 {{ voteMap[item.id]?.recommend ?? item.recommendVotes }}
          </button>
          <button
            class="button-ink"
            type="button"
            :class="{ 'is-selected': voteMap[item.id]?.type === 'avoid' }"
            @click="vote(item.id, 'avoid', item.recommendVotes, item.avoidVotes)"
          >
            避雷 {{ voteMap[item.id]?.avoid ?? item.avoidVotes }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'CanteenCarousel',
});

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);
const router = useRouter();
const voteMap = reactive({});
const trackRef = ref(null);
const isPaused = ref(false);
let timer = null;

function handleSelect(canteenId) {
  emit('select', canteenId);
  router.push({ name: 'canteenDetail', params: { canteenId } });
}

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
  }, 2600);
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
.canteen-carousel {
  margin-top: var(--ft-space-5);
}

.canteen-carousel__header {
  margin-bottom: var(--ft-space-2);
}

.canteen-carousel__track {
  --peek: clamp(72px, 14vw, 220px);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc(100% - var(--peek));
  gap: var(--ft-space-2);
  overflow-x: auto;
  padding-right: var(--peek);
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.canteen-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 10px;
  scroll-snap-align: start;
}

.canteen-card--0 {
  transform: translateY(0);
}

.canteen-card--1 {
  transform: translateY(12px);
}

.canteen-card__entry {
  border: 0;
  width: 100%;
  padding: 0;
  margin: 0;
  text-align: left;
  background: none;
  color: inherit;
  cursor: pointer;
}

.canteen-card__image {
  width: 100%;
  height: 196px;
  object-fit: cover;
}

.canteen-card__image.is-hard-cut {
  border: 1px solid var(--ft-color-secondary);
}

.canteen-card__image.is-polaroid {
  border: 8px solid #fff;
  border-bottom-width: 24px;
  box-shadow: 4px 4px 0 rgb(58 36 24 / 30%);
}

.canteen-card__content {
  margin-top: 10px;
}

.canteen-card__title-line {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 30px;
    font-weight: 900;
    line-height: 1.04;
  }
}

.canteen-card__score {
  margin: 8px 0 0;
  color: var(--ft-color-primary);
  font-family: var(--ft-font-family-title);
  font-size: 28px;
  font-weight: 900;
}

.canteen-card__meta {
  margin: 2px 0 0;
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.canteen-card__rant {
  margin: 8px 0 0;
  color: var(--ft-color-primary);
  font-size: 22px;
}

.canteen-card__actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.button-ink.is-selected {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--ft-color-secondary);
}
</style>
