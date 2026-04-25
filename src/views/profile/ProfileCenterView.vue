<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import LeaderDotsRow from '../../components/print/LeaderDotsRow.vue';
import PrintSectionHead from '../../components/print/PrintSectionHead.vue';
import PrintStamp from '../../components/print/PrintStamp.vue';
import ScoreLine from '../../components/print/ScoreLine.vue';
import Stamp from '../../components/print/Stamp.vue';
import VoteButtons from '../../components/print/VoteButtons.vue';
import {
  getHomeRecommendedDishes,
  issueInfo,
} from '../../constants/mock/foodData';

defineOptions({ name: 'ProfileCenterView' });

const router = useRouter();
const favoriteList = computed(() => getHomeRecommendedDishes(3));

function goHome() {
  router.push({ name: 'home' });
}
</script>

<template>
  <section class="print-container grid gap-4">
    <header
      class="grid gap-2 border border-ink p-3 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <p
          class="m-0 text-[12px] font-sans font-black tracking-[0.08em] text-maroon"
        >
          学生证副页
        </p>
        <h1 class="m-0 font-serif text-[40px] font-black tracking-tightprint">
          个人干饭档案
        </h1>
        <p class="m-0 text-[14px] italic">
          {{ issueInfo.issueNo }}｜北交干饭吧内部流转页。
        </p>
      </div>
      <button type="button" class="h-fit px-4 py-2" @click="goHome">
        返回首页
      </button>
    </header>

    <section class="print-ticket grid gap-3 p-3">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="m-0 text-[12px] font-sans">证号 [No.03]</p>
          <h2 class="m-0 font-serif text-[34px] font-black">匿名同学</h2>
          <p class="m-0 text-[13px] italic">身份：北京交通大学在校生</p>
        </div>
        <PrintStamp text="学生证" :rotate="-3" />
      </div>

      <div class="grid gap-1 text-[14px]">
        <LeaderDotsRow left="状态" right="有效" />
        <LeaderDotsRow left="偏好" right="盖饭 / 热汤 / 夜宵" />
        <LeaderDotsRow
          left="更新"
          right="2026-04-25"
          right-class="print-price"
        />
      </div>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="14"
        title="近期常点"
        subtitle="个人记录"
        marker="☆"
      />
      <article
        v-for="dish in favoriteList"
        :key="dish.id"
        class="print-interactive-card grid gap-2 border-b border-ink px-2 py-2"
      >
        <div class="grid gap-1">
          <LeaderDotsRow
            :left="dish.name"
            :right="`￥${dish.price}`"
            left-class="font-serif text-[24px]"
            right-class="print-price text-[17px]"
          />
          <p class="m-0 text-[13px] italic text-maroon">
            {{ dish.bestFor }}｜{{ dish.windowName }}
          </p>
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
      </article>
    </section>
  </section>
</template>
