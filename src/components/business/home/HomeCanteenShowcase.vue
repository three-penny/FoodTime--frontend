<script setup>
defineOptions({ name: 'HomeCanteenShowcase' });

defineProps({
  canteens: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['view-detail', 'view-menu']);

const toneList = [
  { bg: '#fffaf1', accent: '#c9341e' },
  { bg: '#f4f6ee', accent: '#5b7a3a' },
  { bg: '#f9f1ea', accent: '#3a2418' },
  { bg: '#f6f1e8', accent: '#7b3224' },
];

function getToneStyle(index) {
  const tone = toneList[index % toneList.length];

  return {
    '--canteen-bg': tone.bg,
    '--canteen-accent': tone.accent,
  };
}

function getSpanClass(index) {
  return index === 0 || index === 3 ? 'is-wide' : 'is-compact';
}
</script>

<template>
  <div class="home-canteen-showcase">
    <article
      v-for="(canteen, index) in canteens"
      :key="canteen.id"
      class="home-canteen-showcase__item"
      :class="getSpanClass(index)"
      :style="getToneStyle(index)"
    >
      <div class="home-canteen-showcase__head">
        <span class="home-canteen-showcase__stamp ft-stamp">{{
          canteen.stamp
        }}</span>
        <div>
          <p class="home-canteen-showcase__eyebrow">
            CANTEEN {{ String(index + 1).padStart(2, '0') }}
          </p>
          <h3>{{ canteen.name }}</h3>
        </div>
      </div>

      <p class="home-canteen-showcase__brief">{{ canteen.brief }}</p>
      <p class="home-canteen-showcase__note ft-handwrite">
        “{{ canteen.note }}”
      </p>

      <div class="home-canteen-showcase__facts">
        <div>
          <span>最近教学楼</span>
          <strong>步行 {{ canteen.walkMinutes }} 分钟</strong>
        </div>
        <div>
          <span>现在排队</span>
          <strong>约 {{ canteen.queueCount }} 人</strong>
        </div>
        <div>
          <span>价格</span>
          <strong class="ft-number"
            >¥{{ canteen.averagePrice }} / 日常一顿</strong
          >
        </div>
        <div>
          <span>今天适合</span>
          <strong>{{ canteen.bestFor }}</strong>
        </div>
      </div>

      <div class="home-canteen-showcase__list">
        <span>常点菜</span>
        <strong>{{ canteen.mustOrder.join(' / ') }}</strong>
      </div>

      <div class="home-canteen-showcase__actions">
        <button
          class="ft-button ft-button--primary"
          type="button"
          @click="emit('view-detail', canteen.id)"
        >
          去食堂
        </button>
        <button
          class="ft-button"
          type="button"
          @click="emit('view-menu', canteen.id)"
        >
          看菜单
        </button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.home-canteen-showcase {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 18px;
}

.home-canteen-showcase__item {
  display: grid;
  gap: 18px;
  padding: 22px;
  border-top: 2px solid var(--canteen-accent);
  background: var(--canteen-bg);
  box-shadow: var(--ft-shadow-soft);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.home-canteen-showcase__item.is-wide {
  grid-column: span 7;
}

.home-canteen-showcase__item.is-compact {
  grid-column: span 5;
}

.home-canteen-showcase__item:hover {
  transform: translateY(-4px);
  box-shadow: var(--ft-shadow-medium);
}

.home-canteen-showcase__head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.home-canteen-showcase__stamp {
  color: var(--canteen-accent);
  border-color: var(--canteen-accent);
}

.home-canteen-showcase__eyebrow {
  margin: 0 0 8px;
  color: var(--ft-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.home-canteen-showcase__head h3 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 30px;
  font-weight: 900;
  line-height: 1.12;
}

.home-canteen-showcase__brief {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.8;
}

.home-canteen-showcase__note {
  margin: 0;
  color: var(--canteen-accent);
  font-size: 28px;
  line-height: 1.2;
}

.home-canteen-showcase__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.home-canteen-showcase__facts div,
.home-canteen-showcase__list {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid rgba(58, 36, 24, 0.1);
  background: rgba(255, 255, 255, 0.54);
}

.home-canteen-showcase__facts span,
.home-canteen-showcase__list span {
  color: var(--ft-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-canteen-showcase__list strong {
  color: var(--ft-text-secondary);
  line-height: 1.8;
}

.home-canteen-showcase__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 1100px) {
  .home-canteen-showcase__item.is-wide,
  .home-canteen-showcase__item.is-compact {
    grid-column: span 12;
  }
}

@media (max-width: 720px) {
  .home-canteen-showcase__facts {
    grid-template-columns: 1fr;
  }
}
</style>
