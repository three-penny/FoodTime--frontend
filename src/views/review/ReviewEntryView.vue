<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ErrataStrip from '../../components/print/ErrataStrip.vue';
import LeaderDotsRow from '../../components/print/LeaderDotsRow.vue';
import PrintSectionHead from '../../components/print/PrintSectionHead.vue';
import ScoreLine from '../../components/print/ScoreLine.vue';
import Stamp from '../../components/print/Stamp.vue';
import {
  canteenList,
  getErrataNotes,
  issueInfo,
} from '../../constants/mock/foodData';

defineOptions({ name: 'ReviewEntryView' });

const router = useRouter();
const errataList = computed(() => getErrataNotes(4));

function goHome() {
  router.push({ name: 'home' });
}

function goToCanteen(canteenId) {
  router.push({
    name: 'canteenDetail',
    params: { canteenId },
  });
}
</script>

<template>
  <div class="print-container grid gap-4">
    <header
      class="grid gap-2 border border-ink p-3 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <p
          class="m-0 text-[12px] font-sans font-black tracking-[0.08em] text-maroon"
        >
          投稿入口
        </p>
        <h1 class="m-0 font-serif text-[40px] font-black tracking-tightprint">
          食堂勘误与点评投递
        </h1>
        <p class="m-0 text-[14px] italic">
          {{ issueInfo.issueNo }}｜仅收校内真实体验，不收广告稿。
        </p>
      </div>
      <button type="button" class="h-fit px-4 py-2" @click="goHome">
        返回首页
      </button>
    </header>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="12"
        title="投稿目录"
        subtitle="按食堂分号"
        marker="◆"
      />
      <article
        v-for="canteen in canteenList"
        :key="canteen.id"
        class="print-interactive-card grid gap-2 border-b border-ink px-2 py-2"
      >
        <button
          type="button"
          class="grid gap-1 border-0 bg-transparent p-0 text-left"
          @click="goToCanteen(canteen.id)"
        >
          <LeaderDotsRow
            :left="`${canteen.romanNo} ${canteen.name}`"
            :right="`人均￥${canteen.averagePrice}`"
            left-class="font-serif text-[24px]"
            right-class="print-price text-[16px]"
          />
          <p class="m-0 text-[13px] italic text-maroon">
            {{ canteen.queueHint }}
          </p>
        </button>

        <div class="flex flex-wrap items-start justify-between gap-2">
          <Stamp
            :level="canteen.ratingLevel"
            :votes="canteen.ratingVotes"
            :seed="canteen.id"
          />
          <ScoreLine :score="canteen.rating" />
        </div>
      </article>
    </section>

    <section class="grid gap-2 border border-ink p-3">
      <PrintSectionHead
        no="13"
        title="近期勘误"
        subtitle="编务公开"
        marker="※"
      />
      <ErrataStrip v-for="text in errataList" :key="text" :text="text" />
    </section>
  </div>
</template>
