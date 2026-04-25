<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ErrataStrip from '../../components/print/ErrataStrip.vue';
import LeaderDotsRow from '../../components/print/LeaderDotsRow.vue';
import PrintSectionHead from '../../components/print/PrintSectionHead.vue';
import PrintStamp from '../../components/print/PrintStamp.vue';
import ScoreLine from '../../components/print/ScoreLine.vue';
import Stamp from '../../components/print/Stamp.vue';
import VoteButtons from '../../components/print/VoteButtons.vue';
import {
  getCanteenById,
  getDishById,
  getErrataNotes,
  getRelatedDishes,
} from '../../constants/mock/foodData';

defineOptions({ name: 'DishDetailView' });

const route = useRoute();
const router = useRouter();

const canteen = computed(() => getCanteenById(route.params.canteenId));
const dish = computed(() =>
  getDishById(route.params.canteenId, route.params.dishId),
);
const relatedDishes = computed(() =>
  getRelatedDishes(route.params.canteenId, route.params.dishId, 4),
);
const errataList = computed(() => getErrataNotes(2));

function goHome() {
  router.push({ name: 'home' });
}

function goDishList() {
  router.push({
    name: 'dishList',
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
</script>

<template>
  <div v-if="canteen && dish" class="print-container grid gap-4">
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
        @click="goDishList"
      >
        {{ canteen.name }}
      </button>
      <span>＞</span>
      <span>{{ dish.name }}</span>
    </div>

    <section class="grid gap-3 border border-ink p-3 lg:grid-cols-[420px_1fr]">
      <div class="grid gap-2">
        <figure class="m-0 grid gap-1">
          <div class="relative border border-ink">
            <img
              class="h-[320px] object-cover"
              :src="dish.image"
              :alt="dish.imageAlt"
            />
            <div class="absolute left-2 top-2">
              <PrintStamp :text="dish.stamp" :rotate="-3" />
            </div>
          </div>
          <figcaption class="photo-caption">
            ▲ {{ dish.imageCaption }}
          </figcaption>
        </figure>
      </div>

        <div class="grid gap-2">
          <div class="grid gap-2">
            <div>
              <p
                class="m-0 text-[12px] font-sans font-black tracking-[0.08em] text-maroon"
              >
                单品档案
            </p>
            <h1
              class="m-0 font-serif text-[40px] font-black tracking-tightprint"
              >
                {{ dish.name }}
              </h1>
            </div>
            <div class="flex flex-wrap items-start justify-between gap-2">
              <Stamp
                :level="dish.ratingLevel"
                :votes="dish.ratingVotes"
                :seed="dish.id"
              />
              <div class="grid justify-items-end gap-1">
                <ScoreLine :score="dish.rating" />
                <VoteButtons
                  :recommend-base="dish.recommendCount"
                  :bad-base="dish.badCount"
                />
              </div>
            </div>
          </div>

          <p class="m-0 text-[14px] italic">{{ dish.review }}</p>
        <div class="grid gap-1 text-[14px]">
          <LeaderDotsRow
            :left="'窗口'"
            :right="`${canteen.name}｜${dish.windowName}`"
          />
          <LeaderDotsRow
            :left="'价格'"
            :right="`￥${dish.price}`"
            right-class="print-price"
          />
          <LeaderDotsRow
            :left="'出餐'"
            :right="dish.cookingTime"
            right-class="print-price"
          />
          <LeaderDotsRow :left="'适合'" :right="dish.bestFor" />
          <LeaderDotsRow :left="'口味'" :right="dish.spicyLevel" />
        </div>

        <div class="grid gap-1 border border-ink p-2 text-[13px]">
          <p class="m-0 font-sans font-bold">配料表</p>
          <p class="m-0">{{ dish.ingredients.join('｜') }}</p>
        </div>
      </div>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="10"
        title="同档可选"
        subtitle="同食堂关联"
        marker="☆"
      />
      <article
        v-for="item in relatedDishes"
        :key="item.id"
        class="print-interactive-card grid gap-2 border-b border-ink px-2 py-2"
      >
        <button
          type="button"
          class="grid gap-2 border-0 bg-transparent p-0 text-left"
          @click="goDishDetail(item.id)"
        >
          <div class="grid gap-1">
            <LeaderDotsRow
              :left="item.name"
              :right="`￥${item.price}`"
              left-class="font-serif text-[23px]"
              right-class="print-price text-[17px]"
            />
            <p class="m-0 text-[13px] italic text-maroon">{{ item.brief }}</p>
          </div>
        </button>
        <div class="flex flex-wrap items-start justify-between gap-2">
          <Stamp
            :level="item.ratingLevel"
            :votes="item.ratingVotes"
            :seed="item.id"
          />
          <div class="grid justify-items-end gap-1">
            <ScoreLine :score="item.rating" />
            <VoteButtons
              :recommend-base="item.recommendCount"
              :bad-base="item.badCount"
            />
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead no="11" title="编者注" subtitle="档案修订" marker="※" />
      <ErrataStrip v-for="text in errataList" :key="text" :text="text" />
    </section>
  </div>

  <section v-else class="print-container grid gap-3 border border-ink p-4">
    <h1 class="m-0 font-serif text-[36px] font-black">未找到该菜品档案</h1>
    <button type="button" class="w-fit px-4 py-2" @click="goDishList">
      返回菜单
    </button>
  </section>
</template>
