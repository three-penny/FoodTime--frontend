<template>
  <section class="recommend" data-test="today-recommend">
    <header class="recommend__header">
      <h2 class="section-title">今日推荐</h2>
      <p class="section-subtitle">根据评分与近期热度精选，先看图，再决定要不要冲。</p>
    </header>

    <el-carousel
      height="330px"
      indicator-position="outside"
      trigger="click"
      arrow="always"
    >
      <el-carousel-item v-for="item in items" :key="item.id">
        <article class="recommend-card">
          <img
            class="recommend-card__image"
            :src="item.image"
            :alt="`${item.name}菜品图`"
            loading="lazy"
          />
          <div class="recommend-card__content">
            <p class="recommend-card__canteen">{{ item.canteenName }}</p>
            <h3 class="recommend-card__title">{{ item.name }}</h3>
            <div class="recommend-card__meta">
              <el-rate :model-value="item.rating" disabled allow-half />
              <span>{{ item.rating.toFixed(1) }}</span>
            </div>
            <div class="recommend-card__tags">
              <el-tag
                v-for="tag in item.tags"
                :key="`${item.id}-${tag}`"
                effect="plain"
                round
              >
                {{ tag }}
              </el-tag>
            </div>
            <el-button type="primary" plain @click="jumpToDish(item)">
              查看菜品详情
            </el-button>
          </div>
        </article>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

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

function jumpToDish(item) {
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
}

.recommend__header {
  margin-bottom: var(--ft-space-2);
}

.recommend-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--ft-space-3);
  height: 100%;
  padding: var(--ft-space-3);
  border-radius: var(--ft-radius-lg);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-md);

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--ft-radius-md);
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  &__canteen {
    margin: 0;
    font-size: var(--ft-font-size-sm);
    color: var(--ft-color-text-muted);
  }

  &__title {
    margin: 0;
    font-size: 30px;
    line-height: 1.2;
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--ft-color-secondary);
    font-weight: 700;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 920px) {
  .recommend-card {
    grid-template-columns: 1fr;
    padding: var(--ft-space-2);

    &__image {
      min-height: 170px;
    }

    &__title {
      font-size: 26px;
    }
  }
}
</style>
