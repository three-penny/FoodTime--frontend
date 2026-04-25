<script setup>
defineOptions({ name: 'HomeHero' });

defineProps({
  mealLabel: {
    type: String,
    default: '',
  },
  featuredDish: {
    type: Object,
    required: true,
  },
  canteens: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'review-click',
  'recommend-click',
  'canteen-click',
  'open-dish',
]);
</script>

<template>
  <section class="home-hero">
    <div class="home-hero__copy">
      <span class="home-hero__kicker">{{ mealLabel }}</span>
      <h1>北交干饭吧</h1>
      <p class="home-hero__slogan">
        不是找最好吃的那一口，是记住每次饿的时候，自己最后都会走进哪一家。
      </p>

      <div class="home-hero__actions">
        <button
          class="ft-button ft-button--primary"
          type="button"
          @click="emit('review-click')"
        >
          我要点评
        </button>
        <button
          class="ft-button"
          type="button"
          @click="emit('recommend-click')"
        >
          美食推荐
        </button>
      </div>

      <div class="home-hero__notes">
        <button
          v-for="canteen in canteens"
          :key="canteen.id"
          class="home-hero__note"
          type="button"
          @click="emit('canteen-click', canteen.id)"
        >
          <strong>{{ canteen.name }}</strong>
          <span>步行 {{ canteen.walkMinutes }} 分钟</span>
        </button>
      </div>
    </div>

    <div class="home-hero__feature">
      <div class="home-hero__feature-main">
        <span class="home-hero__badge">{{ featuredDish.stamp }}</span>
        <div
          class="home-hero__feature-frame"
          @click="emit('open-dish', featuredDish)"
        >
          <img
            :src="featuredDish.image"
            :alt="featuredDish.name"
            class="home-hero__image"
          />
        </div>
        <div class="home-hero__feature-copy">
          <p class="home-hero__feature-label">今日先吃</p>
          <h2>{{ featuredDish.name }}</h2>
          <p class="home-hero__feature-review">{{ featuredDish.review }}</p>
          <div class="home-hero__feature-meta">
            <span>{{ featuredDish.windowName }}</span>
            <span class="ft-number"
              >¥{{ featuredDish.price }} / {{ featuredDish.valueNote }}</span
            >
          </div>
        </div>
      </div>

      <div class="home-hero__feature-side">
        <article class="home-hero__side-card">
          <span class="home-hero__side-card-title ft-handwrite"
            >今天的直觉</span
          >
          <strong>{{ canteens[0]?.name }}</strong>
          <p>现在排队约 {{ canteens[0]?.queueCount }} 人</p>
        </article>
        <article class="home-hero__side-card home-hero__side-card--green">
          <span class="home-hero__side-card-title ft-handwrite">晚一点去</span>
          <strong>{{ canteens[3]?.mustOrder?.[0] }}</strong>
          <p>{{ canteens[3]?.note }}</p>
        </article>
      </div>

      <svg
        class="home-hero__decoration"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <path
          d="M35 18c4 0 8 3 8 7v44c0 4-3 7-8 7s-8-3-8-7V25c0-4 4-7 8-7Zm39 0c5 0 8 3 8 7v36c0 5-3 8-8 8h-3v25c0 4-4 8-8 8s-7-4-7-8V18h18Zm-39 62h39"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="5"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  gap: 28px;
  align-items: start;
}

.home-hero__copy {
  display: grid;
  gap: 24px;
  padding-top: 18px;
}

.home-hero__kicker {
  display: inline-flex;
  width: fit-content;
  padding: 8px 12px;
  border: 1px solid rgba(58, 36, 24, 0.14);
  color: var(--ft-primary-deep);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  transform: rotate(-2deg);
  background: rgba(255, 255, 255, 0.86);
}

.home-hero__copy h1 {
  margin: 0;
  max-width: 7ch;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: clamp(72px, 10vw, 132px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.08em;
}

.home-hero__slogan {
  margin: 0;
  max-width: 18ch;
  color: var(--ft-text-secondary);
  font-size: 16px;
  line-height: 1.9;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.home-hero__notes {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.home-hero__note {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid rgba(58, 36, 24, 0.14);
  color: inherit;
  text-align: left;
  background: rgba(255, 255, 255, 0.74);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.home-hero__note strong {
  font-size: 15px;
}

.home-hero__note span {
  color: var(--ft-text-muted);
  font-size: 12px;
}

.home-hero__note:hover {
  transform: translateY(-2px);
  border-color: var(--ft-primary);
  box-shadow: var(--ft-shadow-soft);
}

.home-hero__feature {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 16px;
}

.home-hero__feature-main {
  position: relative;
  display: grid;
  gap: 16px;
}

.home-hero__badge {
  position: absolute;
  left: -10px;
  top: 18px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  min-height: 64px;
  padding: 10px;
  border: 2px solid var(--ft-primary);
  color: var(--ft-primary);
  font-size: 15px;
  font-weight: 900;
  background: rgba(242, 239, 230, 0.9);
  transform: rotate(-5deg);
}

.home-hero__feature-frame {
  position: relative;
  min-height: 560px;
  padding: 18px 18px 34px;
  background: #fffdf7;
  box-shadow: var(--ft-shadow-medium);
  cursor: pointer;
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}

.home-hero__feature-frame:hover {
  transform: translateY(-4px);
  box-shadow: var(--ft-shadow-hover);
}

.home-hero__feature-frame::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 30px;
  background: #fffdf7;
  clip-path: polygon(
    0 42%,
    8% 62%,
    16% 38%,
    24% 68%,
    32% 40%,
    40% 60%,
    48% 34%,
    56% 64%,
    64% 38%,
    72% 66%,
    80% 42%,
    88% 58%,
    96% 36%,
    100% 54%,
    100% 100%,
    0 100%
  );
}

.home-hero__image {
  width: 100%;
  height: 100%;
  min-height: 508px;
  object-fit: cover;
}

.home-hero__feature-copy {
  display: grid;
  gap: 10px;
  padding-left: 20px;
}

.home-hero__feature-label {
  margin: 0;
  color: var(--ft-primary-deep);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-hero__feature-copy h2 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 900;
  line-height: 1.08;
}

.home-hero__feature-review {
  column-count: 2;
  column-gap: 18px;
  margin: 0;
  color: var(--ft-text-secondary);
  font-size: 14px;
  line-height: 1.9;
}

.home-hero__feature-review::first-letter {
  float: left;
  padding-right: 8px;
  color: var(--ft-primary);
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 44px;
  font-weight: 900;
  line-height: 0.9;
}

.home-hero__feature-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--ft-text-muted);
  font-size: 13px;
}

.home-hero__feature-side {
  display: grid;
  gap: 14px;
}

.home-hero__side-card {
  display: grid;
  align-content: end;
  gap: 8px;
  min-height: 274px;
  padding: 18px;
  border: 1px solid rgba(58, 36, 24, 0.14);
  background: rgba(255, 255, 255, 0.68);
  box-shadow: var(--ft-shadow-soft);
}

.home-hero__side-card--green {
  border-color: rgba(91, 122, 58, 0.18);
  background: rgba(230, 238, 221, 0.86);
}

.home-hero__side-card-title {
  color: var(--ft-primary);
  font-size: 24px;
}

.home-hero__side-card strong {
  font-size: 24px;
  line-height: 1.25;
}

.home-hero__side-card p {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.8;
}

.home-hero__decoration {
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 104px;
  height: 104px;
  color: rgba(58, 36, 24, 0.34);
}

@media (max-width: 1080px) {
  .home-hero,
  .home-hero__feature {
    grid-template-columns: 1fr;
  }

  .home-hero__feature-side {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .home-hero__notes,
  .home-hero__feature-side {
    grid-template-columns: 1fr;
  }

  .home-hero__feature-frame {
    min-height: auto;
  }

  .home-hero__image {
    min-height: 360px;
  }

  .home-hero__feature-review {
    column-count: 1;
  }
}
</style>
