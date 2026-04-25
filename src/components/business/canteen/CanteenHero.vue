<script setup>
defineOptions({ name: 'CanteenHero' });

defineProps({
  canteen: {
    type: Object,
    required: true,
  },
  dishCount: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <section class="canteen-hero">
    <img :src="canteen.image" :alt="canteen.name" class="canteen-hero__image" />

    <div class="canteen-hero__content">
      <div class="canteen-hero__top">
        <div>
          <p class="canteen-hero__eyebrow">食堂</p>
          <h1>{{ canteen.name }}</h1>
        </div>
        <span class="ft-chip">{{ canteen.rating.toFixed(1) }} 分</span>
      </div>

      <p class="canteen-hero__tagline">{{ canteen.tagline }}</p>
      <p class="canteen-hero__brief">{{ canteen.brief }}</p>

      <div class="canteen-hero__facts">
        <div>
          <span>位置</span>
          <strong>{{ canteen.location }}</strong>
        </div>
        <div>
          <span>营业</span>
          <strong class="ft-number">{{ canteen.businessHours }}</strong>
        </div>
        <div>
          <span>人均</span>
          <strong class="ft-number">¥{{ canteen.averagePrice }}</strong>
        </div>
        <div>
          <span>菜品</span>
          <strong>{{ dishCount }} 道</strong>
        </div>
      </div>

      <div class="canteen-hero__bottom">
        <p>排队：{{ canteen.queueHint }}</p>
        <p>常点：{{ canteen.mustOrder.join(' / ') }}</p>
      </div>

      <div class="canteen-hero__actions">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.canteen-hero {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-panel);
  background: var(--ft-surface);
  box-shadow: var(--ft-shadow-soft);
}

.canteen-hero__image {
  width: 100%;
  min-height: 260px;
  border-radius: 16px;
  object-fit: cover;
}

.canteen-hero__content {
  display: grid;
  align-content: start;
  gap: 14px;
}

.canteen-hero__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.canteen-hero__eyebrow {
  margin: 0 0 8px;
  color: var(--ft-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.canteen-hero__top h1 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: clamp(32px, 5vw, 44px);
}

.canteen-hero__tagline,
.canteen-hero__brief,
.canteen-hero__bottom p {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.7;
}

.canteen-hero__tagline {
  color: var(--ft-ink);
  font-size: 18px;
  font-weight: 700;
}

.canteen-hero__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.canteen-hero__facts div {
  display: grid;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--ft-border);
  border-radius: 14px;
  background: var(--ft-surface-strong);
}

.canteen-hero__facts span {
  color: var(--ft-text-muted);
  font-size: 12px;
}

.canteen-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 920px) {
  .canteen-hero {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .canteen-hero__top {
    flex-direction: column;
    align-items: flex-start;
  }

  .canteen-hero__facts {
    grid-template-columns: 1fr;
  }
}
</style>
