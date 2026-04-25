<template>
  <section class="canteen-carousel" data-test="canteen-carousel">
    <header class="canteen-carousel__header">
      <h2 class="section-title">食堂选择</h2>
      <p class="section-subtitle">按口味与出餐节奏选食堂，先看环境与特色再下决定。</p>
    </header>

    <div class="canteen-carousel__track">
      <article
        v-for="canteen in canteens"
        :key="canteen.id"
        class="canteen-card"
        @click="handleSelect(canteen.id)"
      >
        <img :src="canteen.image" :alt="`${canteen.name}食堂图`" loading="lazy" />
        <div class="canteen-card__content">
          <h3>{{ canteen.name }}</h3>
          <p>{{ canteen.summary }}</p>
          <div class="canteen-card__meta">
            <span>{{ canteen.location }}</span>
            <span>评分 {{ canteen.rating.toFixed(1) }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({
  name: 'CanteenCarousel',
});

const props = defineProps({
  canteens: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select']);
const router = useRouter();

function handleSelect(canteenId) {
  emit('select', canteenId);
  router.push({ name: 'canteenDetail', params: { canteenId } });
}
</script>

<style scoped lang="scss">
.canteen-carousel {
  margin-top: var(--ft-space-5);
}

.canteen-carousel__header {
  margin-bottom: var(--ft-space-2);
}

.canteen-carousel__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(260px, 1fr);
  gap: var(--ft-space-2);
  overflow-x: auto;
  padding-bottom: 12px;
  scroll-snap-type: x mandatory;
}

.canteen-card {
  scroll-snap-align: start;
  border-radius: var(--ft-radius-md);
  overflow: hidden;
  cursor: pointer;
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
  transition: transform var(--ft-transition-base), box-shadow var(--ft-transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--ft-shadow-md);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
}

.canteen-card__content {
  padding: var(--ft-space-2);

  h3 {
    margin: 0 0 8px;
    font-size: var(--ft-font-size-lg);
  }

  p {
    margin: 0;
    color: var(--ft-color-text-muted);
    line-height: 1.6;
    min-height: 68px;
  }
}

.canteen-card__meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  color: var(--ft-color-secondary);
  font-size: var(--ft-font-size-sm);
  gap: 8px;
}
</style>
