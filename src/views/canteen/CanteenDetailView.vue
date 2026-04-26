<!-- @author Codex -->

<template>
  <section class="canteen-detail-view">
    <article v-if="!canteen" class="empty torn-edge">
      <h1>未找到该食堂</h1>
      <p>你可能点到了旧链接。回首页重新选择一次即可。</p>
      <button class="button-ink is-primary" type="button" @click="goHome">返回首页</button>
    </article>

    <template v-else>
      <article class="hero torn-edge">
        <img class="hero__image" :src="canteen.image" :alt="`${canteen.name}环境图`" />
        <div class="hero__content">
          <span class="sticker sticker--r-1">食堂档案</span>
          <h1>{{ canteen.name }}</h1>
          <p class="hero__meta">
            评分 {{ canteen.rating.toFixed(1) }} · {{ canteen.location }} ·
            {{ canteen.openHours }}
          </p>
          <p class="hero__summary dropcap">{{ canteen.summary }}</p>
          <p class="hero__rant handwrite">
            学生吐槽：{{ formatComment(canteen.rant, 42).text }}
            <span>（{{ formatComment(canteen.rant, 42).length }}字）</span>
          </p>
          <div class="hero__actions">
            <button class="button-ink is-primary" type="button" @click="toDishList">
              查看菜品列表
            </button>
            <button class="button-ink" type="button" @click="goHome">返回首页</button>
          </div>
        </div>
      </article>

      <section class="blocks">
        <article
          v-for="(block, index) in canteen.introBlocks"
          :key="`${canteen.id}-${block.title}`"
          class="blocks__item torn-edge"
          :class="index % 2 === 0 ? 'is-left-heavy' : 'is-right-heavy'"
        >
          <h2>{{ block.title }}</h2>
          <p>{{ block.content }}</p>
        </article>
      </section>

      <section class="hot">
        <div class="section-rule">
          <span class="section-rule__index">05</span>
          <span class="section-rule__line"></span>
        </div>
        <header class="hot__header">
          <h2 class="section-title">这家店最稳的菜</h2>
          <p class="section-subtitle">按评分倒序，先看最强三道再做选择。</p>
        </header>

        <div class="hot__layout">
          <DishCard
            v-for="(dish, index) in hotDishes"
            :key="dish.id"
            :dish="dish"
            :tilt="index % 2 === 0"
            :image-shape="index % 3 === 0 ? 'polygon' : index % 3 === 1 ? 'hard' : 'polaroid'"
            clickable
            @click="toDishDetail(dish.id)"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DishCard from '../../components/dish/DishCard.vue';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useDishStore } from '../../store/useDishStore';
import { formatComment } from '../../utils/commentText';

defineOptions({
  name: 'CanteenDetailView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();

const canteenId = computed(() => String(route.params.canteenId ?? ''));
const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const hotDishes = computed(() =>
  dishStore.dishes
    .filter(dish => dish.canteenId === canteenId.value)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
);

watch(
  canteenId,
  id => {
    canteenStore.setActiveCanteen(id);
  },
  { immediate: true }
);

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

function toDishList() {
  router.push({
    name: 'dishList',
    params: { canteenId: canteenId.value },
  });
}

function toDishDetail(dishId) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: canteenId.value,
      dishId,
    },
  });
}
</script>

<style scoped lang="scss">
.empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 26px;

  h1 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 46px;
  }

  p {
    margin: 8px 0 0;
    color: var(--ft-color-text-muted);
  }
}

.hero {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
}

.hero__image {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  clip-path: polygon(0 0, 100% 0, 96% 100%, 0 100%);
}

.hero__content {
  padding: 20px 18px;

  h1 {
    margin: 10px 0 0;
    font-family: var(--ft-font-family-title);
    font-size: clamp(44px, 6vw, 68px);
    line-height: 0.95;
  }
}

.hero__meta {
  margin: 12px 0 0;
  color: var(--ft-color-text-muted);
}

.hero__summary {
  margin: 10px 0 0;
  color: var(--ft-color-secondary-soft);
}

.hero__rant {
  margin: 14px 0 0;
  color: var(--ft-color-primary);
  font-size: 24px;
}

.hero__rant span {
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.hero__actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.blocks {
  margin-top: var(--ft-space-3);
  display: grid;
  gap: 10px;
}

.blocks__item {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface-ink);
  padding: 14px 16px;

  h2 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 30px;
    font-weight: 900;
  }

  p {
    margin: 8px 0 0;
    color: var(--ft-color-secondary-soft);
  }
}

.blocks__item.is-left-heavy {
  width: 72%;
}

.blocks__item.is-right-heavy {
  width: 72%;
  justify-self: end;
}

.hot {
  margin-top: var(--ft-space-4);
}

.hot__header {
  margin-bottom: var(--ft-space-2);
}

.hot__layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--ft-space-2);
}

@media (max-width: 980px) {
  .hero,
  .hot__layout {
    grid-template-columns: 1fr;
  }

  .blocks__item.is-left-heavy,
  .blocks__item.is-right-heavy {
    width: 100%;
  }
}
</style>
