<!-- @author XXXXX -->

<template>
  <article
    class="canteen-stall-card torn-edge"
    :class="{ 'is-expanded': expanded }"
    data-test="canteen-stall-card"
  >
    <div class="canteen-stall-card__info">
      <span class="canteen-stall-card__photo-frame">
        <img class="canteen-stall-card__photo" :src="stall.image" :alt="`${stall.name}档口图`" loading="lazy" />
      </span>
      <span class="canteen-stall-card__copy">
        <span class="sticker sticker--r-1">档口</span>
        <strong>{{ stall.name }}</strong>
        <span class="canteen-stall-card__summary">{{ stall.summary }}</span>
        <span class="canteen-stall-card__facts">
          <span>人均 {{ stall.avgPrice }}</span>
          <span>推荐 {{ stall.bestTime }}</span>
          <span>{{ sortedDishes.length }} 道菜</span>
        </span>
      </span>
    </div>

    <div class="canteen-stall-card__dishes">
      <button
        v-for="dish in visibleDishes"
        :key="dish.id"
        class="canteen-stall-card__dish"
        type="button"
        @click="emit('dish-click', dish)"
      >
        <div class="canteen-stall-card__dish-body">
          <div class="canteen-stall-card__dish-title">
            <h3>{{ dish.name }}</h3>
            <span class="stamp">评分 {{ dish.rating.toFixed(1) }}</span>
          </div>
          <div class="canteen-stall-card__dish-meta">
            <span>¥{{ dish.price }}</span>
            <span>{{ dish.stall }}</span>
          </div>
          <p>真实评价：{{ dish.comment }}</p>
        </div>
      </button>

      <button
        v-if="hiddenCount > 0"
        class="canteen-stall-card__toggle button-ink"
        type="button"
        :aria-expanded="String(expanded)"
        @click="toggleExpanded"
      >
        {{ expanded ? '收起菜品' : `展开其余 ${hiddenCount} 道` }}
      </button>
    </div>
  </article>
</template>

<script setup>
/**
 * CanteenStallCard
 * 职责：展示食堂详情页中的单个档口，并按评分展示前三个菜品，其余菜品折叠。
 * 作者：XXXXX
 * 使用场景：食堂详细页档口展开列表。
 * 依赖：Vue 局部状态、全局 zine 视觉类。
 * 注意：展开状态属于当前卡片交互，不进入 Pinia，避免污染跨页面状态。
 */
import { computed, ref } from 'vue';

defineOptions({
  name: 'CanteenStallCard',
});

const props = defineProps({
  stall: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['dish-click']);

const expanded = ref(false);

const sortedDishes = computed(() =>
  [...(props.stall.dishes ?? [])].sort((a, b) => b.rating - a.rating),
);
const visibleDishes = computed(() =>
  expanded.value ? sortedDishes.value : sortedDishes.value.slice(0, 3),
);
const hiddenCount = computed(() => Math.max(sortedDishes.value.length - 3, 0));

function toggleExpanded() {
  if (hiddenCount.value > 0) {
    expanded.value = !expanded.value;
  }
}
</script>

<style scoped lang="scss">
.canteen-stall-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: minmax(280px, 0.38fr) minmax(0, 0.62fr);
  min-width: 0;
  overflow: hidden;
}

.canteen-stall-card__info {
  appearance: none;
  border: 0;
  border-right: 1px dashed rgb(58 36 24 / 36%);
  background:
    radial-gradient(circle at 82% 12%, rgb(183 47 28 / 9%) 0, transparent 28%),
    var(--ft-color-surface-ink);
  color: inherit;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  padding: 14px;
  text-align: left;
  transition: background var(--ft-transition-fast), transform var(--ft-transition-fast);
}

.canteen-stall-card__info:hover {
  background:
    radial-gradient(circle at 82% 12%, rgb(183 47 28 / 13%) 0, transparent 30%),
    var(--zine-paper-card-alt);
}

.canteen-stall-card__photo-frame {
  position: relative;
  display: block;
  border: 1px solid var(--ft-color-secondary);
  background: #fff;
  padding: 8px 8px 22px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 18%);
  transform: rotate(-0.8deg);
}

.canteen-stall-card__photo-frame::before {
  content: '';
  position: absolute;
  width: 92px;
  height: 26px;
  left: 18px;
  top: -14px;
  background: var(--zine-decor-tape-blue) center / contain no-repeat;
  opacity: 0.78;
  mix-blend-mode: multiply;
}

.canteen-stall-card__photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.canteen-stall-card__copy {
  display: grid;
  align-content: start;
  gap: 8px;
}

.canteen-stall-card__copy strong {
  font-family: var(--ft-font-family-title);
  font-size: clamp(32px, 3.8vw, 50px);
  font-weight: 900;
  line-height: 1;
}

.canteen-stall-card__summary {
  color: var(--ft-color-secondary-soft);
  line-height: 1.55;
}

.canteen-stall-card__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.canteen-stall-card__facts span {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 54%);
  padding: 2px 7px;
  color: var(--ft-color-text-muted);
  font-size: 12px;
}

.canteen-stall-card__toggle {
  justify-self: start;
  margin-top: 2px;
  color: var(--ft-color-primary);
  font-family: var(--ft-font-family-note);
  font-size: 22px;
}

.canteen-stall-card__dishes {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 14px;
}

.canteen-stall-card__dish {
  appearance: none;
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  color: inherit;
  cursor: pointer;
  font: inherit;
  min-width: 0;
  padding: 0;
  text-align: left;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 12%);
  transition: transform var(--ft-transition-fast), box-shadow var(--ft-transition-fast);
}

.canteen-stall-card__dish:hover {
  box-shadow: 5px 5px 0 rgb(58 36 24 / 18%);
}

.canteen-stall-card__dish:nth-child(2n) {
  transform: rotate(0.4deg);
}

.canteen-stall-card__dish:nth-child(2n + 1) {
  transform: rotate(-0.3deg);
}

.canteen-stall-card__dish-body {
  display: grid;
  gap: 8px;
  padding: 11px 12px;
}

.canteen-stall-card__dish-title {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.canteen-stall-card__dish-title h3 {
  margin: 0;
  font-family: var(--ft-font-family-title);
  font-size: 26px;
  line-height: 1.05;
}

.canteen-stall-card__dish-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.canteen-stall-card__dish-meta span {
  border: 1px dashed rgb(58 36 24 / 32%);
  padding: 2px 7px;
  color: var(--ft-color-secondary);
  font-size: 13px;
  font-weight: 700;
}

.canteen-stall-card__dish-body p {
  margin: 0;
  color: var(--ft-color-secondary-soft);
  font-size: 13px;
  line-height: 1.45;
  display: -webkit-box;
  min-height: calc(1.45em * 2);
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (max-width: 980px) {
  .canteen-stall-card {
    grid-template-columns: 1fr;
  }

  .canteen-stall-card__info {
    border-right: 0;
    border-bottom: 1px dashed rgb(58 36 24 / 36%);
  }

  .canteen-stall-card__dishes {
    grid-template-columns: 1fr;
  }

  .canteen-stall-card__dish-title {
    align-items: start;
  }
}

@media (max-width: 520px) {
  .canteen-stall-card__info,
  .canteen-stall-card__dishes {
    padding: 12px;
  }

  .canteen-stall-card__photo-frame {
    transform: none;
  }

  .canteen-stall-card__copy strong {
    font-size: clamp(30px, 10vw, 40px);
  }

  .canteen-stall-card__dish-title {
    display: grid;
    justify-content: stretch;
  }

  .canteen-stall-card__dish-title .stamp {
    justify-self: start;
  }

  .canteen-stall-card__toggle {
    width: 100%;
  }
}
</style>
