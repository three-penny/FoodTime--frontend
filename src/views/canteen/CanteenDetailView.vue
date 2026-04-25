<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ErrataStrip from '../../components/print/ErrataStrip.vue';
import LeaderDotsRow from '../../components/print/LeaderDotsRow.vue';
import PrintSectionHead from '../../components/print/PrintSectionHead.vue';
import ScoreLine from '../../components/print/ScoreLine.vue';
import Stamp from '../../components/print/Stamp.vue';
import VoteButtons from '../../components/print/VoteButtons.vue';
import {
  getCanteenById,
  getDishesByCanteenId,
  getErrataNotes,
  issueInfo,
} from '../../constants/mock/foodData';

defineOptions({ name: 'CanteenDetailView' });

const route = useRoute();
const router = useRouter();

const canteen = computed(() => getCanteenById(route.params.canteenId));
const dishes = computed(() => getDishesByCanteenId(route.params.canteenId));
const errataList = computed(() => getErrataNotes(3));

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
      <span>{{ canteen.name }}</span>
      <span class="ml-auto">{{ issueInfo.issueNo }}</span>
    </div>

    <section
      class="grid gap-3 border border-ink p-3 lg:grid-cols-[80px_1fr_300px]"
    >
      <p
        class="print-red-title m-0 font-serif text-[72px] font-black leading-none"
      >
        {{ canteen.romanNo }}
      </p>
      <div class="grid gap-2">
        <div class="grid gap-2">
          <div>
            <h1
              class="m-0 font-serif text-[42px] font-black tracking-tightprint"
            >
              {{ canteen.name }}
            </h1>
            <p class="m-0 italic">{{ canteen.oneLineReview }}</p>
          </div>
          <div class="flex flex-wrap items-start justify-between gap-2">
            <Stamp
              :level="canteen.ratingLevel"
              :votes="canteen.ratingVotes"
              :seed="canteen.id"
            />
            <ScoreLine :score="canteen.rating" />
          </div>
        </div>
        <p class="m-0">{{ canteen.brief }}</p>
        <div class="grid gap-1 text-[14px]">
          <LeaderDotsRow :left="'位置'" :right="canteen.location" />
          <LeaderDotsRow
            :left="'营业时间'"
            :right="canteen.businessHours"
            right-class="print-price"
          />
          <LeaderDotsRow
            :left="'人均'"
            :right="`￥${canteen.averagePrice}`"
            right-class="print-price"
          />
          <LeaderDotsRow
            :left="'步行'"
            :right="`${canteen.walkMinutes} 分钟`"
          />
        </div>
      </div>
      <figure class="m-0 grid gap-1">
        <div class="border border-ink">
          <img
            class="h-[220px] object-cover"
            :src="canteen.image"
            :alt="canteen.imageAlt"
          />
        </div>
        <figcaption class="photo-caption">
          ▲ {{ canteen.imageCaption }}
        </figcaption>
      </figure>
    </section>

    <section class="grid gap-3">
      <PrintSectionHead
        no="06"
        title="窗口价目"
        subtitle="分号菜单"
        marker="▲"
      />
      <div class="grid gap-2 border border-ink p-3">
        <article
          v-for="dish in dishes"
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
                {{ dish.windowName }}｜{{ dish.bestFor }}
              </p>
            </div>
          </button>
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
        </article>
      </div>
      <button type="button" class="w-fit px-4 py-2" @click="goDishList">
        查看本食堂完整菜单
      </button>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="07"
        title="勘误补记"
        subtitle="档案附注"
        marker="※"
      />
      <ErrataStrip v-for="text in errataList" :key="text" :text="text" />
    </section>
  </div>

  <section v-else class="print-container grid gap-3 border border-ink p-4">
    <h1 class="m-0 font-serif text-[36px] font-black">未找到该食堂档案</h1>
    <button type="button" class="w-fit px-4 py-2" @click="goHome">
      返回首页
    </button>
  </section>
</template>
