<script setup>
import { computed } from 'vue';
import { canteenList } from '../../../constants/mock/foodData';

defineOptions({ name: 'HomeRankList' });

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

const podiumList = computed(() => props.dishes.slice(0, 3));
const restList = computed(() => props.dishes.slice(3));
</script>

<template>
  <section class="home-rank-list">
    <div class="home-rank-list__podium">
      <article
        v-for="(dish, index) in podiumList"
        :key="dish.id"
        class="home-rank-list__podium-card"
        :class="`is-rank-${index + 1}`"
        @click="emit('open-dish', dish)"
      >
        <span class="home-rank-list__podium-no">{{
          String(index + 1).padStart(2, '0')
        }}</span>
        <img
          :src="dish.image"
          :alt="dish.name"
          class="home-rank-list__podium-image"
        />
        <div class="home-rank-list__podium-overlay" />
        <div class="home-rank-list__podium-copy">
          <span class="ft-stamp home-rank-list__podium-stamp">{{
            dish.stamp
          }}</span>
          <strong>{{ dish.name }}</strong>
          <p>
            {{ canteenNameMap[dish.canteenId] }} / ¥{{ dish.price }} /
            {{ dish.valueNote }}
          </p>
        </div>
      </article>
    </div>

    <div class="home-rank-list__list">
      <article
        v-for="(dish, index) in restList"
        :key="dish.id"
        class="home-rank-list__row"
        @click="emit('open-dish', dish)"
      >
        <span class="home-rank-list__row-no ft-number">{{
          String(index + 4).padStart(2, '0')
        }}</span>
        <div class="home-rank-list__row-main">
          <strong>{{ dish.name }}</strong>
          <p>{{ canteenNameMap[dish.canteenId] }} / {{ dish.brief }}</p>
        </div>
        <div class="home-rank-list__row-side">
          <span class="home-rank-list__row-stamp">{{ dish.stamp }}</span>
          <span class="ft-number">¥{{ dish.price }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home-rank-list {
  display: grid;
  gap: 18px;
}

.home-rank-list__podium {
  display: grid;
  grid-template-columns: 1.3fr 0.85fr 0.85fr;
  gap: 18px;
}

.home-rank-list__podium-card {
  position: relative;
  min-height: 320px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--ft-shadow-medium);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.home-rank-list__podium-card.is-rank-1 {
  min-height: 430px;
}

.home-rank-list__podium-card:hover,
.home-rank-list__row:hover {
  transform: translateY(-4px);
  box-shadow: var(--ft-shadow-hover);
}

.home-rank-list__podium-no {
  position: absolute;
  left: 18px;
  top: 18px;
  z-index: 2;
  color: #fff9f4;
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 34px;
  font-weight: 900;
}

.home-rank-list__podium-image,
.home-rank-list__podium-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.home-rank-list__podium-image {
  object-fit: cover;
}

.home-rank-list__podium-overlay {
  background: linear-gradient(
    180deg,
    rgba(16, 10, 8, 0.08) 0%,
    rgba(16, 10, 8, 0.74) 100%
  );
}

.home-rank-list__podium-copy {
  position: absolute;
  inset: auto 18px 18px 18px;
  z-index: 2;
  display: grid;
  gap: 10px;
  color: #fff9f4;
}

.home-rank-list__podium-stamp {
  color: #fff9f4;
  border-color: rgba(255, 249, 244, 0.72);
}

.home-rank-list__podium-copy strong {
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.12;
}

.home-rank-list__podium-copy p {
  margin: 0;
  color: rgba(255, 249, 244, 0.84);
  line-height: 1.7;
}

.home-rank-list__list {
  display: grid;
  gap: 12px;
}

.home-rank-list__row {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border-top: 1px solid rgba(58, 36, 24, 0.22);
  background: rgba(255, 255, 255, 0.48);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.home-rank-list__row:hover {
  background: rgba(255, 255, 255, 0.84);
}

.home-rank-list__row-no {
  color: var(--ft-primary-deep);
  font-size: 18px;
  font-weight: 800;
}

.home-rank-list__row-main {
  display: grid;
  gap: 6px;
}

.home-rank-list__row-main strong {
  font-size: 18px;
}

.home-rank-list__row-main p {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.7;
}

.home-rank-list__row-side {
  display: grid;
  justify-items: end;
  gap: 8px;
}

.home-rank-list__row-stamp {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 36px;
  padding: 6px 10px;
  border: 2px solid var(--ft-primary);
  color: var(--ft-primary);
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 960px) {
  .home-rank-list__podium {
    grid-template-columns: 1fr;
  }

  .home-rank-list__podium-card.is-rank-1,
  .home-rank-list__podium-card {
    min-height: 280px;
  }
}

@media (max-width: 680px) {
  .home-rank-list__row {
    grid-template-columns: 44px 1fr;
  }

  .home-rank-list__row-side {
    grid-column: 2 / 3;
    justify-items: start;
  }
}
</style>
