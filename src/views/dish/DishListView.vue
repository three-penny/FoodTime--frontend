<!-- @author XXXXX -->

<template>
  <section class="dish-list-view">
    <article v-if="!canteen" class="empty torn-edge">
      <h1>食堂不存在</h1>
      <p>链接可能已过期，回首页再选一次。</p>
      <button class="button-ink is-primary" type="button" @click="goHome">
        返回首页
      </button>
    </article>

    <template v-else>
      <article class="hero torn-edge">
        <img
          class="hero__image"
          :src="canteen.image"
          :alt="`${canteen.name}环境图`"
        />
        <div class="hero__content">
          <span class="sticker sticker--r-1">食堂档案</span>
          <h1>{{ canteen.name }}</h1>
          <p class="hero__meta">
            评分 {{ (canteen.rating ?? 0).toFixed(1) }} · {{ canteen.location }} ·
            {{ canteen.openHours }}
          </p>
          <p class="hero__summary dropcap">{{ canteen.summary }}</p>
          <div class="hero__facts">
            <span v-for="fact in heroFacts" :key="fact.label">
              <strong>{{ fact.label }}</strong
              >{{ fact.value }}
            </span>
          </div>
          <p class="hero__rant handwrite">
            学生吐槽：{{ formatComment(canteen.rant, 42).text }}
            <span>（{{ formatComment(canteen.rant, 42).length }}字）</span>
          </p>
          <div class="hero__actions">
            <button class="button-ink" type="button" @click="goHome">
              返回首页
            </button>
          </div>
        </div>
      </article>

      <section class="stalls" data-test="dish-list-stalls">
        <div class="section-rule">
          <span class="section-rule__index">06</span>
          <span class="section-rule__line"></span>
        </div>
        <header class="stalls__header">
          <h2 class="section-title">全部档口</h2>
          <p class="section-subtitle">
            点击左侧档口信息可展开全部菜品，点击菜品可查看详情及同学真实评价。
          </p>
        </header>

        <p v-if="stallSections.length === 0" class="stalls__empty">
          该食堂暂无档口数据，快去上传新菜品吧。
        </p>

        <div v-else class="stalls__list">
          <CanteenStallCard
            v-for="stall in stallSections"
            :key="stall.id"
            :stall="stall"
            @dish-click="toDishDetail"
            @edit-dish="onEditDish"
            @delete-dish="onDeleteDish"
            @edit-stall="onEditStall"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CanteenStallCard from '../../components/canteen/CanteenStallCard.vue';
import { useCanteenStore } from '../../store/useCanteenStore';
import { updateDish, deleteDish as deleteDishApi } from '../../api/dish.api';
import { updateStall, uploadImage } from '../../api/canteen.api';
import { formatComment } from '../../utils/commentText';

defineOptions({
  name: 'DishListView',
});

const route = useRoute();
const router = useRouter();
const canteenStore = useCanteenStore();

const canteenId = computed(() => String(route.params.canteenId ?? ''));
const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const stallSections = ref([]);
const heroFacts = computed(() =>
  canteen.value
    ? [
        { label: '人均', value: canteen.value.avgPrice },
        { label: '高峰', value: canteen.value.peakQueue },
        { label: '推荐', value: canteen.value.bestTime },
      ]
    : [],
);

watch(
  canteenId,
  async (id) => {
    canteenStore.setActiveCanteen(id);
    if (id) {
      await canteenStore.loadCanteenDetail(id);
      stallSections.value = await canteenStore.loadStallsByCanteen(id);
    }
  },
  { immediate: true },
);

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

function toDishDetail(dish) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: canteenId.value,
      dishId: dish.id,
    },
  });
}

async function onEditStall(stall) {
  try {
    let imageUrl = undefined;
    if (stall._imageFile) {
      const uploadRes = await uploadImage('stall_img', stall._imageFile);
      imageUrl = uploadRes.data?.url || undefined;
    }
    await updateStall(stall.id, {
      name: stall.name,
      avg_price: stall.avgPrice,
      best_time: stall.bestTime,
      summary: stall.summary,
      image_url: imageUrl,
    });
    stallSections.value = await canteenStore.loadStallsByCanteen(canteenId.value);
  } catch (e) {
    console.error('更新档口失败:', e);
  }
}

async function onEditDish(dish) {
  try {
    let imageUrl = undefined;
    if (dish._imageFile) {
      const uploadRes = await uploadImage('dish_img', dish._imageFile);
      imageUrl = uploadRes.data?.url || undefined;
    }
    await updateDish(dish.id, {
      name: dish.name,
      price: dish.price,
      description: dish.description,
      rating: dish.rating,
      image_url: imageUrl,
    });
    stallSections.value = await canteenStore.loadStallsByCanteen(canteenId.value);
  } catch (e) {
    console.error('更新菜品失败:', e);
  }
}

async function onDeleteDish(dish) {
  try {
    await deleteDishApi(dish.id);
    stallSections.value = await canteenStore.loadStallsByCanteen(canteenId.value);
  } catch (e) {
    console.error('删除菜品失败:', e);
  }
}
</script>

<style scoped lang="scss">
.empty {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 22px;
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

.hero__facts {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.hero__facts span {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 54%);
  padding: 7px 9px;
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.hero__facts strong {
  display: block;
  color: var(--ft-color-secondary);
  font-size: 12px;
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

.stalls {
  margin-top: var(--ft-space-4);
}

.stalls__header {
  margin-bottom: var(--ft-space-2);
}

.stalls__list {
  display: grid;
  gap: var(--ft-space-2);
}

.stalls__empty {
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 62%);
  color: var(--ft-color-text-muted);
  padding: 18px;
  margin: 0;
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero__image {
    min-height: 280px;
    clip-path: none;
  }

  .hero__facts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .empty {
    padding: 18px;
  }

  .hero__image {
    min-height: 220px;
  }

  .hero__content {
    padding: 18px 16px;

    h1 {
      font-size: clamp(38px, 13vw, 52px);
    }
  }

  .hero__rant {
    font-size: 21px;
  }

  .hero__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
