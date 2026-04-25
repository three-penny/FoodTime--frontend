<script setup>
import { computed } from 'vue';
import { canteenList } from '../../../constants/mock/foodData';

defineOptions({ name: 'HomeRecommendationCarousel' });

const props = defineProps({
  dishes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['open-dish']);

const canteenNameMap = computed(() =>
  Object.fromEntries(canteenList.map((item) => [item.id, item.name])),
);

const featureDish = computed(() => props.dishes[0] || null);
const listDishes = computed(() => props.dishes.slice(1));
</script>

<template>
  <section class="home-recommendation-carousel">
    <article
      v-if="featureDish"
      class="home-recommendation-carousel__feature"
      @click="emit('open-dish', featureDish)"
    >
      <div class="home-recommendation-carousel__feature-media">
        <img
          :src="featureDish.image"
          :alt="featureDish.name"
          class="home-recommendation-carousel__feature-image"
        />
      </div>

      <div class="home-recommendation-carousel__feature-copy">
        <div class="home-recommendation-carousel__feature-head">
          <span class="home-recommendation-carousel__feature-stamp ft-stamp">
            {{ featureDish.stamp }}
          </span>
          <span
            class="home-recommendation-carousel__feature-sticker ft-handwrite"
          >
            今天先点这个
          </span>
        </div>

        <div>
          <p class="home-recommendation-carousel__eyebrow">
            {{ canteenNameMap[featureDish.canteenId] }} /
            {{ featureDish.windowName }}
          </p>
          <h3>{{ featureDish.name }}</h3>
        </div>

        <p class="home-recommendation-carousel__feature-review">
          {{ featureDish.review }}
        </p>

        <div class="home-recommendation-carousel__feature-meta">
          <span>{{ featureDish.bestFor }}</span>
          <span>{{ featureDish.spicyLevel }}</span>
          <span class="ft-number">
            ¥{{ featureDish.price }} / {{ featureDish.valueNote }}
          </span>
        </div>
      </div>
    </article>

    <div class="home-recommendation-carousel__list">
      <article
        v-for="(dish, index) in listDishes"
        :key="dish.id"
        class="home-recommendation-carousel__card"
        :class="{
          'is-polaroid': index % 2 === 0,
          'is-cut': index % 2 === 1,
        }"
        @click="emit('open-dish', dish)"
      >
        <div class="home-recommendation-carousel__card-media">
          <img
            :src="dish.image"
            :alt="dish.name"
            class="home-recommendation-carousel__card-image"
          />
        </div>

        <div class="home-recommendation-carousel__card-copy">
          <div class="home-recommendation-carousel__card-head">
            <strong>{{ dish.name }}</strong>
            <span class="home-recommendation-carousel__mini-stamp">{{
              dish.stamp
            }}</span>
          </div>
          <p>{{ dish.brief }}</p>
          <div class="home-recommendation-carousel__card-meta">
            <span>{{ canteenNameMap[dish.canteenId] }}</span>
            <span class="ft-number"
              >¥{{ dish.price }} / {{ dish.valueNote }}</span
            >
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-recommendation-carousel {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 20px;
}

.home-recommendation-carousel__feature {
  display: grid;
  grid-template-columns: minmax(280px, 0.46fr) minmax(0, 0.54fr);
  gap: 18px;
  padding: 18px;
  border-top: 2px solid var(--ft-brown);
  border-bottom: 2px solid var(--ft-brown);
  background: rgba(255, 255, 255, 0.44);
  cursor: pointer;
}

.home-recommendation-carousel__feature-media {
  position: relative;
  min-height: 460px;
  padding: 14px;
  background: #fffdf7;
  box-shadow: var(--ft-shadow-medium);
}

.home-recommendation-carousel__feature-media::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 22px;
  background: #fffdf7;
  clip-path: polygon(
    0 46%,
    10% 66%,
    20% 34%,
    30% 64%,
    40% 36%,
    50% 60%,
    60% 34%,
    70% 66%,
    80% 40%,
    90% 62%,
    100% 42%,
    100% 100%,
    0 100%
  );
}

.home-recommendation-carousel__feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-recommendation-carousel__feature-copy {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 12px 0;
}

.home-recommendation-carousel__feature-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.home-recommendation-carousel__feature-stamp {
  color: var(--ft-primary);
}

.home-recommendation-carousel__feature-sticker {
  display: inline-flex;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid rgba(58, 36, 24, 0.14);
  color: var(--ft-brown);
  font-size: 24px;
  transform: rotate(3deg);
  background: rgba(255, 255, 255, 0.82);
}

.home-recommendation-carousel__eyebrow {
  margin: 0 0 8px;
  color: var(--ft-text-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.home-recommendation-carousel__feature-copy h3 {
  margin: 0;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 900;
  line-height: 1.08;
}

.home-recommendation-carousel__feature-review {
  column-count: 2;
  column-gap: 18px;
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.9;
}

.home-recommendation-carousel__feature-review::first-letter {
  float: left;
  padding-right: 8px;
  color: var(--ft-primary);
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 42px;
  font-weight: 900;
  line-height: 0.9;
}

.home-recommendation-carousel__feature-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--ft-text-muted);
  font-size: 13px;
}

.home-recommendation-carousel__list {
  display: grid;
  gap: 16px;
}

.home-recommendation-carousel__card {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(58, 36, 24, 0.12);
  background: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.home-recommendation-carousel__card:hover {
  transform: translateY(-3px);
  border-color: var(--ft-primary);
  box-shadow: var(--ft-shadow-medium);
}

.home-recommendation-carousel__card.is-polaroid
  .home-recommendation-carousel__card-media {
  padding: 10px 10px 18px;
  background: #fffdf8;
  box-shadow: var(--ft-shadow-soft);
}

.home-recommendation-carousel__card.is-cut
  .home-recommendation-carousel__card-image {
  clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
}

.home-recommendation-carousel__card-media {
  min-height: 140px;
}

.home-recommendation-carousel__card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-recommendation-carousel__card-copy {
  display: grid;
  gap: 10px;
}

.home-recommendation-carousel__card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.home-recommendation-carousel__card-head strong {
  font-size: 20px;
  line-height: 1.18;
}

.home-recommendation-carousel__mini-stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;
  padding: 8px;
  border: 2px solid var(--ft-primary);
  color: var(--ft-primary);
  font-size: 12px;
  font-weight: 800;
}

.home-recommendation-carousel__card-copy p {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.75;
}

.home-recommendation-carousel__card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--ft-text-muted);
  font-size: 13px;
}

@media (max-width: 1080px) {
  .home-recommendation-carousel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .home-recommendation-carousel__feature {
    grid-template-columns: 1fr;
  }

  .home-recommendation-carousel__feature-media {
    min-height: 340px;
  }

  .home-recommendation-carousel__feature-review {
    column-count: 1;
  }

  .home-recommendation-carousel__card {
    grid-template-columns: 1fr;
  }
}
</style>
