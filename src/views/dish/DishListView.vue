<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ErrataStrip from '../../components/print/ErrataStrip.vue';
import LeaderDotsRow from '../../components/print/LeaderDotsRow.vue';
import PrintSectionHead from '../../components/print/PrintSectionHead.vue';
import ScoreLine from '../../components/print/ScoreLine.vue';
import Stamp from '../../components/print/Stamp.vue';
import VoteButtons from '../../components/print/VoteButtons.vue';
import {
  getCanteenById,
  getDishCategories,
  getDishesByCanteenId,
  getErrataNotes,
} from '../../constants/mock/foodData';

defineOptions({ name: 'DishListView' });

const route = useRoute();
const router = useRouter();

const filters = ref({
  keyword: '',
  category: '全部',
  sortBy: 'salesDesc',
});

const canteen = computed(() => getCanteenById(route.params.canteenId));
const categories = computed(() => [
  '全部',
  ...getDishCategories(route.params.canteenId),
]);
const dishes = computed(() => getDishesByCanteenId(route.params.canteenId));
const errataList = computed(() => getErrataNotes(2));

const filteredDishes = computed(() => {
  const keyword = filters.value.keyword.trim().toLowerCase();

  const list = dishes.value.filter((item) => {
    const keywordMatch = !keyword || item.name.toLowerCase().includes(keyword);
    const categoryMatch =
      filters.value.category === '全部' ||
      item.category === filters.value.category;

    return keywordMatch && categoryMatch;
  });

  return [...list].sort((left, right) => {
    if (filters.value.sortBy === 'priceAsc') {
      return left.price - right.price;
    }

    if (filters.value.sortBy === 'ratingDesc') {
      return right.rating - left.rating;
    }

    return right.monthlySales - left.monthlySales;
  });
});

function goHome() {
  router.push({ name: 'home' });
}

function goCanteenDetail() {
  router.push({
    name: 'canteenDetail',
    params: { canteenId: route.params.canteenId },
  });
}

function goDishDetail(dishId) {
  router.push({
    name: 'dishDetail',
    params: {
      canteenId: route.params.canteenId,
      dishId,
    },
  });
}

function resetFilters() {
  filters.value = {
    keyword: '',
    category: '全部',
    sortBy: 'salesDesc',
  };
}
</script>

<template>
  <div v-if="canteen" class="print-container grid gap-4">
    <div class="flex flex-wrap items-center gap-2 text-[13px] font-sans">
      <button
        type="button"
        class="border-0 bg-transparent p-0 underline"
        @click="goHome"
      >
        首页
      </button>
      <span>＞</span>
      <button
        type="button"
        class="border-0 bg-transparent p-0 underline"
        @click="goCanteenDetail"
      >
        {{ canteen.name }}
      </button>
      <span>＞ 菜单</span>
    </div>

    <section class="grid gap-3 border border-ink p-3">
      <PrintSectionHead
        no="08"
        title="整版价目表"
        subtitle="菜单筛选"
        marker="◆"
      />
      <div class="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_auto]">
        <label class="grid gap-1 text-[13px]">
          关键词
          <input
            v-model="filters.keyword"
            type="text"
            placeholder="输入菜名"
            class="h-[36px] px-2"
          />
        </label>
        <label class="grid gap-1 text-[13px]">
          分类
          <select v-model="filters.category" class="h-[36px] px-2">
            <option v-for="item in categories" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
        </label>
        <label class="grid gap-1 text-[13px]">
          排序
          <select v-model="filters.sortBy" class="h-[36px] px-2">
            <option value="salesDesc">月售优先</option>
            <option value="ratingDesc">口碑优先</option>
            <option value="priceAsc">价格优先</option>
          </select>
        </label>
        <button
          type="button"
          class="h-[36px] px-3 self-end"
          @click="resetFilters"
        >
          重置
        </button>
      </div>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="m-0 font-serif text-[30px] font-black">
          {{ canteen.name }} 菜单
        </h2>
        <span class="text-[13px] font-sans"
          >共 {{ filteredDishes.length }} 项</span
        >
      </div>

      <article
        v-for="dish in filteredDishes"
        :key="dish.id"
        class="print-interactive-card grid gap-2 border-b border-ink px-2 py-2"
      >
        <button
          type="button"
          class="grid gap-2 border-0 bg-transparent p-0 text-left"
          @click="goDishDetail(dish.id)"
        >
          <div class="grid gap-1">
            <LeaderDotsRow
              :left="dish.name"
              :right="`￥${dish.price}`"
              left-class="font-serif text-[24px]"
              right-class="print-price text-[18px]"
            />
            <p class="m-0 text-[13px] italic text-maroon">
              {{ dish.windowName }}｜{{ dish.review }}
            </p>
          </div>
        </button>
        <div class="flex flex-wrap items-start justify-between gap-2">
          <Stamp :level="dish.ratingLevel" :votes="dish.ratingVotes" :seed="dish.id" />
          <div class="grid justify-items-end gap-1">
            <ScoreLine :score="dish.rating" />
            <VoteButtons
              :recommend-base="dish.recommendCount"
              :bad-base="dish.badCount"
            />
          </div>
        </div>
      </article>

      <p
        v-if="filteredDishes.length === 0"
        class="m-0 py-4 text-center text-[14px]"
      >
        暂无符合条件的菜品记录。
      </p>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="09"
        title="菜单勘误"
        subtitle="当日变更"
        marker="※"
      />
      <ErrataStrip v-for="text in errataList" :key="text" :text="text" />
    </section>
  </div>

  <section v-else class="print-container grid gap-3 border border-ink p-4">
    <h1 class="m-0 font-serif text-[36px] font-black">未找到菜单档案</h1>
    <button type="button" class="w-fit px-4 py-2" @click="goHome">
      返回首页
    </button>
  </section>
</template>
