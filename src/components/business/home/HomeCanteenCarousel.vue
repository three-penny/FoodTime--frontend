<script setup>
defineOptions({ name: 'HomeCanteenCarousel' });

defineProps({
  canteens: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['view-detail', 'view-menu']);
</script>

<template>
  <div class="home-canteen-carousel">
    <article
      v-for="(canteen, index) in canteens"
      :key="canteen.id"
      class="home-canteen-carousel__card"
      :class="{ 'is-featured': index === 0 }"
    >
      <img
        :src="canteen.image"
        :alt="canteen.name"
        class="home-canteen-carousel__image"
      />
      <div class="home-canteen-carousel__overlay" />

      <div class="home-canteen-carousel__content">
        <div class="home-canteen-carousel__top">
          <span class="home-canteen-carousel__stamp ft-stamp">{{
            canteen.stamp
          }}</span>
          <span class="ft-chip">排队 {{ canteen.queueCount }} 人</span>
        </div>

        <div class="home-canteen-carousel__bottom">
          <div>
            <h3>{{ canteen.name }}</h3>
            <p>{{ canteen.location }}</p>
          </div>

          <div class="home-canteen-carousel__meta">
            <span>步行 {{ canteen.walkMinutes }} 分钟</span>
            <span class="ft-number"
              >¥{{ canteen.averagePrice }} / 一顿够用</span
            >
          </div>

          <div class="home-canteen-carousel__actions">
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
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.home-canteen-carousel {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 2px 4px 10px;
  scrollbar-width: none;
}

.home-canteen-carousel::-webkit-scrollbar {
  display: none;
}

.home-canteen-carousel__card {
  flex: 0 0 360px;
  position: relative;
  min-height: 440px;
  overflow: hidden;
  box-shadow: var(--ft-shadow-medium);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.home-canteen-carousel__card.is-featured {
  flex-basis: 460px;
}

.home-canteen-carousel__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ft-shadow-hover);
}

.home-canteen-carousel__image,
.home-canteen-carousel__overlay,
.home-canteen-carousel__content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.home-canteen-carousel__image {
  object-fit: cover;
}

.home-canteen-carousel__overlay {
  background:
    linear-gradient(
      180deg,
      rgba(16, 10, 8, 0.08) 0%,
      rgba(16, 10, 8, 0.18) 44%,
      rgba(16, 10, 8, 0.82) 100%
    ),
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.2),
      transparent 24%
    );
}

.home-canteen-carousel__content {
  display: grid;
  align-content: space-between;
  padding: 18px;
  color: #fff9f4;
}

.home-canteen-carousel__top,
.home-canteen-carousel__meta,
.home-canteen-carousel__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.home-canteen-carousel__stamp {
  color: #fff9f4;
  border-color: rgba(255, 249, 244, 0.72);
}

.home-canteen-carousel__bottom {
  display: grid;
  gap: 14px;
}

.home-canteen-carousel__bottom h3 {
  margin: 0 0 8px;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.08;
}

.home-canteen-carousel__bottom p {
  margin: 0;
  color: rgba(255, 249, 244, 0.84);
  line-height: 1.7;
}

.home-canteen-carousel__meta {
  color: rgba(255, 249, 244, 0.88);
  font-size: 13px;
}

@media (max-width: 640px) {
  .home-canteen-carousel__card.is-featured,
  .home-canteen-carousel__card {
    flex-basis: 86vw;
  }
}
</style>
