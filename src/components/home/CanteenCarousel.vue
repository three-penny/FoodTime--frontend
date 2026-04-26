<!-- @author Codex -->

<template>
  <section class="canteen-carousel" data-test="canteen-carousel">
    <div class="section-rule">
      <span class="section-rule__index">02</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="canteen-carousel__header">
      <div>
        <h2 class="section-title">食堂选择</h2>
        <p class="section-subtitle">十条真实打卡位，评分和吐槽先给你看。</p>
      </div>
      <span class="canteen-carousel__hint handwrite">→ 划划看</span>
    </header>

    <div
      ref="trackRef"
      class="canteen-carousel__track"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerEnd"
      @pointercancel="onPointerEnd"
    >
      <article
        v-for="(item, index) in items"
        :key="item.id"
        class="canteen-card"
        :class="`canteen-card--${index % 4}`"
        role="button"
        tabindex="0"
        @click="handleSelect(item.canteenId)"
        @keydown.enter="handleSelect(item.canteenId)"
      >
        <div class="canteen-card__media" :class="imageFrameClass(index)">
          <span class="canteen-card__postage" aria-hidden="true"></span>
          <span class="canteen-card__tape" :class="index % 2 === 0 ? 'is-left' : 'is-right'"></span>
          <img
            class="canteen-card__image"
            :src="item.image"
            :alt="`${item.name}食堂图`"
            loading="lazy"
            draggable="false"
          />
        </div>

        <div class="canteen-card__content">
          <p class="canteen-card__rant handwrite">
            “{{ formatComment(item.comment, 20).text }}”
            <span>（{{ formatComment(item.comment, 20).length }}字）</span>
          </p>

          <div class="canteen-card__title-row">
            <h3>{{ item.name }}</h3>
            <span class="zine-rating-stamp">{{ item.rating.toFixed(1) }}</span>
          </div>

          <p class="canteen-card__votes handwrite">
            （× {{ item.recommendVotes }} 人推荐）
          </p>

          <div class="canteen-card__chips">
            <span
              v-for="chip in visibleChips(item)"
              :key="`${item.id}-${chip}`"
              class="zine-chip"
            >
              {{ chip }}
            </span>
          </div>

        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDragScroll } from '../../composables/useDragScroll';
import { formatComment } from '../../utils/commentText';
import { getRatingLabel } from '../../utils/ratingLabel';

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
const trackRef = ref(null);
const { isDragging, wasDragged, onPointerDown, onPointerMove, onPointerEnd } =
  useDragScroll(trackRef);

function imageFrameClass(index) {
  const classList = ['is-rotate-right', 'is-rotate-left', 'is-rotate-back', 'is-rotate-soft'];
  return classList[index % classList.length];
}

function visibleChips(item) {
  return [getRatingLabel(item.rating), item.valueNote, `¥${item.price}`].filter(Boolean);
}

function handleSelect(canteenId) {
  if (wasDragged.value) {
    return;
  }

  emit('select', canteenId);
  router.push({ name: 'canteenDetail', params: { canteenId } });
}
</script>

<style scoped lang="scss">
.canteen-carousel {
  margin-top: var(--ft-space-5);
  min-width: 0;
  max-width: 100%;
}

.canteen-carousel__header {
  margin-bottom: var(--ft-space-2);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: end;
}

.canteen-carousel__hint {
  flex: 0 0 auto;
  color: var(--zine-stamp-red);
  font-size: 26px;
  transform: rotate(4deg);
}

.canteen-carousel__track {
  display: flex;
  gap: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 18px 34px 32px 2px;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  cursor: grab;
  touch-action: pan-x;
  user-select: none;
}

.canteen-carousel__track::-webkit-scrollbar {
  display: none;
}

.canteen-carousel__track.is-dragging {
  cursor: grabbing;
}

.canteen-card {
  position: relative;
  flex: 0 0 var(--zine-card-width);
  width: var(--zine-card-width);
  height: var(--zine-card-height);
  margin-right: -22px;
  border: 1px solid var(--ft-color-secondary);
  background:
    radial-gradient(circle at 80% 10%, rgb(63 114 145 / 8%) 0, transparent 24%),
    linear-gradient(180deg, var(--zine-paper-card) 0%, #f8efd9 100%);
  box-shadow: 6px 8px 0 rgb(58 36 24 / 12%);
  display: grid;
  grid-template-rows: 60% 40%;
  padding: 10px;
  scroll-snap-align: start;
  cursor: pointer;
  transition: transform var(--ft-transition-fast), box-shadow var(--ft-transition-fast);
}

.canteen-card:hover {
  box-shadow: 9px 12px 0 rgb(58 36 24 / 17%);
}

.canteen-card--0 {
  transform: rotate(0.6deg) translateY(4px);
}

.canteen-card--1 {
  transform: rotate(-0.8deg) translateY(17px);
}

.canteen-card--2 {
  transform: rotate(0.4deg) translateY(-7px);
}

.canteen-card--3 {
  transform: rotate(-0.3deg) translateY(10px);
}

.canteen-card__media {
  position: relative;
  min-height: 0;
  background: #fff;
  padding: 9px 9px 20px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 22%);
  transform-origin: center;
}

.canteen-card__postage {
  position: absolute;
  inset: 0;
  background: var(--zine-decor-postage) center / 100% 100% no-repeat;
  pointer-events: none;
  z-index: 1;
  opacity: 0.72;
  mix-blend-mode: multiply;
}

.canteen-card__media.is-rotate-left {
  transform: rotate(-1.2deg);
}

.canteen-card__media.is-rotate-right {
  transform: rotate(1.3deg);
}

.canteen-card__media.is-rotate-soft {
  transform: rotate(-0.4deg);
}

.canteen-card__media.is-rotate-back {
  transform: rotate(0.5deg);
}

.canteen-card__tape {
  position: absolute;
  top: -15px;
  width: 88px;
  height: 28px;
  background: var(--zine-decor-tape-blue) center / contain no-repeat;
  opacity: 0.78;
  z-index: 2;
  mix-blend-mode: multiply;
  pointer-events: none;
}

.canteen-card__tape.is-left {
  left: 12px;
  transform: rotate(-8deg);
}

.canteen-card__tape.is-right {
  right: 10px;
  background-image: var(--zine-decor-tape-red);
  transform: rotate(8deg);
}

.canteen-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.canteen-card__content {
  position: relative;
  min-height: 0;
  padding: 10px 2px 0;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  gap: 5px;
}

.canteen-card__rant {
  margin: 0;
  color: var(--zine-stamp-red);
  font-size: 19px;
  line-height: 1.08;
}

.canteen-card__rant span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.canteen-card__title-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

.canteen-card__title-row h3 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.canteen-card__votes {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: 18px;
  line-height: 1.1;
}

.canteen-card__chips {
  align-self: end;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: calc(100% - 60px);
}

@media (max-width: 768px) {
  .canteen-carousel__header {
    align-items: start;
  }

  .canteen-carousel__track {
    gap: 0;
    padding-top: 12px;
  }

  .canteen-card {
    flex-basis: min(76vw, 264px);
    width: min(76vw, 264px);
    height: 374px;
    margin-right: -14px;
  }
}
</style>
