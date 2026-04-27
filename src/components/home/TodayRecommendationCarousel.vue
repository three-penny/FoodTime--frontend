<!-- @author Codex -->

<template>
  <section class="recommend" data-test="today-recommend">
    <div class="section-rule">
      <span class="section-rule__index">01</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="recommend__header">
      <div>
        <h2 class="section-title">今日推荐</h2>
        <p class="section-subtitle">先看分，再看评，再看你要不要冲。</p>
      </div>
      <span class="recommend__hint handwrite">→ 划划看</span>
    </header>

    <div
      ref="trackRef"
      class="recommend__track"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
      @pointerleave="onPointerLeave"
      @lostpointercapture="onLostPointerCapture"
    >
      <article
        v-for="(item, index) in displayItems"
        :key="`${item.id}-${index}`"
        class="recommend-card"
        :class="`recommend-card--${index % 4}`"
        role="button"
        tabindex="0"
        @click="jumpToDish(item)"
        @keydown.enter="jumpToDish(item)"
      >
        <div class="recommend-card__media" :class="imageFrameClass(index)">
          <span
            class="recommend-card__tape"
            :class="index % 2 === 0 ? 'is-left' : 'is-right'"
          ></span>
          <img
            class="recommend-card__image"
            :src="item.image"
            :alt="`${item.name}菜品图`"
            loading="lazy"
            draggable="false"
          />
        </div>

        <div class="recommend-card__content">
          <p class="recommend-card__comment handwrite">
            “{{ formatComment(item.comment, 20).text }}”
          </p>

          <div class="recommend-card__title-row">
            <h3>{{ item.name }}</h3>
            <span class="zine-rating-stamp">{{ item.rating.toFixed(1) }}</span>
          </div>

          <p class="recommend-card__meta">
            {{ item.canteenName }} · {{ item.stall }} ·
            {{ formatPrice(item.price) }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAutoHorizontalScroll } from '../../composables/useAutoHorizontalScroll';
import { useDragScroll } from '../../composables/useDragScroll';
import { formatComment } from '../../utils/commentText';

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
const displayItems = computed(() =>
  props.items.length > 1 ? [...props.items, ...props.items] : props.items,
);
const {
  isDragging,
  wasDragged,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
  onPointerLeave,
  onLostPointerCapture,
} = useDragScroll(trackRef);
useAutoHorizontalScroll(trackRef, {
  pauseWhen: isDragging,
  loopItemCount: computed(() => props.items.length),
  speed: 18,
  pauseOnHover: true,
});

function imageFrameClass(index) {
  const classList = [
    'is-rotate-left',
    'is-rotate-right',
    'is-rotate-soft',
    'is-rotate-back',
  ];
  return classList[index % classList.length];
}

function formatPrice(price) {
  const value = Number(price);

  if (Number.isFinite(value) && value > 0) {
    return `¥${value}`;
  }

  return '价格待补';
}

function jumpToDish(item) {
  if (wasDragged.value || !item?.canteenId || !item?.id) {
    return;
  }

  router.push({
    name: 'dishDetail',
    params: {
      canteenId: item.canteenId,
      dishId: item.id,
    },
  });
}
</script>

<style scoped lang="scss">
.recommend {
  margin-top: var(--ft-space-5);
  min-width: 0;
  max-width: 100%;
}

.recommend__header {
  margin-bottom: var(--ft-space-2);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
}

.recommend__hint {
  flex: 0 0 auto;
  color: var(--zine-stamp-red);
  font-size: 26px;
  transform: rotate(-4deg);
}

.recommend__track {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 18px 34px 30px 2px;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  cursor: grab;
  touch-action: pan-x;
  user-select: none;
}

.recommend__track::-webkit-scrollbar {
  display: none;
}

.recommend__track.is-dragging {
  cursor: grabbing;
}

.recommend-card {
  position: relative;
  flex: 0 0 var(--zine-card-width);
  width: var(--zine-card-width);
  height: clamp(382px, 36vw, 418px);
  margin-right: -22px;
  border: 1px solid var(--ft-color-secondary);
  background:
    radial-gradient(circle at 16% 12%, rgb(183 47 28 / 6%) 0, transparent 24%),
    linear-gradient(180deg, var(--zine-paper-card) 0%, #fdf6e8 100%);
  box-shadow: 6px 8px 0 rgb(58 36 24 / 12%);
  display: grid;
  grid-template-rows: 60% 40%;
  padding: 10px;
  scroll-snap-align: start;
  cursor: pointer;
  transition:
    transform var(--ft-transition-fast),
    box-shadow var(--ft-transition-fast);
}

.recommend-card:hover {
  box-shadow: 9px 12px 0 rgb(58 36 24 / 17%);
}

.recommend-card--0 {
  transform: rotate(-0.9deg) translateY(2px);
}

.recommend-card--1 {
  transform: rotate(0.7deg) translateY(16px);
}

.recommend-card--2 {
  transform: rotate(-0.4deg) translateY(-7px);
}

.recommend-card--3 {
  transform: rotate(1deg) translateY(9px);
}

.recommend-card__media {
  position: relative;
  min-height: 0;
  border: 1px solid var(--ft-color-secondary);
  background: #fff;
  padding: 7px 7px 18px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 22%);
  transform-origin: center;
}

.recommend-card__media.is-rotate-left {
  transform: rotate(-1.3deg);
}

.recommend-card__media.is-rotate-right {
  transform: rotate(1.2deg);
}

.recommend-card__media.is-rotate-soft {
  transform: rotate(-0.5deg);
}

.recommend-card__media.is-rotate-back {
  transform: rotate(0.4deg);
}

.recommend-card__tape {
  position: absolute;
  top: -15px;
  width: 88px;
  height: 28px;
  background: var(--zine-decor-tape-red) center / contain no-repeat;
  opacity: 0.78;
  z-index: 2;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.recommend-card__tape.is-left {
  left: 12px;
  transform: rotate(-8deg);
}

.recommend-card__tape.is-right {
  right: 10px;
  background-image: var(--zine-decor-tape-blue);
  transform: rotate(8deg);
}

.recommend-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.recommend-card__content {
  position: relative;
  min-height: 0;
  padding: 10px 2px 0;
  display: grid;
  grid-template-rows: minmax(42px, auto) auto auto;
  gap: 7px;
}

.recommend-card__comment {
  margin: 0;
  color: var(--zine-stamp-red);
  font-size: 19px;
  line-height: 1.12;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.recommend-card__title-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

.recommend-card__title-row h3 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: var(--zine-card-title-size);
  font-weight: 900;
  line-height: 1;
  overflow-wrap: anywhere;
}

.recommend-card__meta {
  margin: 0;
  color: var(--ft-color-secondary);
  font-family: var(--zine-title-font);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.35;
  text-wrap: balance;
}

@media (max-width: 768px) {
  .recommend__header {
    align-items: start;
  }

  .recommend__track {
    gap: 0;
    padding-top: 12px;
  }

  .recommend-card {
    flex-basis: min(76vw, 264px);
    width: min(76vw, 264px);
    height: 396px;
    margin-right: -14px;
  }
}
</style>
