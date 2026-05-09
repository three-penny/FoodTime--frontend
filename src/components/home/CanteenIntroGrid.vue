<!-- @author XXXXX -->

<template>
  <section class="canteen-intro" data-test="canteen-intro">
    <div class="section-rule">
      <span class="section-rule__index">04</span>
      <span class="section-rule__line"></span>
    </div>
    <header class="canteen-intro__header">
      <h2 class="section-title">四个食堂详细介绍</h2>
      <p class="section-subtitle">不只写“好吃”，还写什么时候去、花多少钱、怎么避坑。</p>
    </header>

    <article
      v-for="(canteen, index) in canteens"
      :key="canteen.id"
      class="canteen-intro__item torn-edge"
      :class="index % 2 === 0 ? 'is-left-heavy' : 'is-right-heavy'"
    >
      <div class="canteen-intro__main">
        <div class="canteen-intro__line">
          <h3>{{ canteen.name }}</h3>
          <span class="stamp">{{ getRatingLabel(canteen.rating) }}</span>
        </div>
        <p class="canteen-intro__score">
          评分 {{ canteen.rating.toFixed(1) }} · {{ canteen.avgPrice }}
        </p>
        <p class="dropcap">{{ canteen.summary }}</p>

        <div class="canteen-intro__facts">
          <p><strong>高峰：</strong>{{ canteen.peakQueue }}</p>
          <p><strong>推荐时段：</strong>{{ canteen.bestTime }}</p>
          <p><strong>营业：</strong>{{ canteen.openHours }}</p>
        </div>

        <div class="canteen-intro__grid">
          <div>
            <h4>招牌菜</h4>
            <ul>
              <li v-for="dish in canteen.signatureDishes" :key="`${canteen.id}-${dish}`">
                {{ dish }}
              </li>
            </ul>
          </div>
          <div>
            <h4>学生笔记</h4>
            <ul>
              <li v-for="note in canteen.studentNotes" :key="`${canteen.id}-${note}`">
                {{ note }}
              </li>
            </ul>
          </div>
        </div>

        <div class="canteen-intro__intro-blocks">
          <article
            v-for="block in canteen.introBlocks"
            :key="`${canteen.id}-${block.title}`"
            class="canteen-intro__block"
          >
            <h5>{{ block.title }}</h5>
            <p>{{ block.content }}</p>
          </article>
        </div>
      </div>

      <aside class="canteen-intro__side">
        <p class="canteen-intro__rant handwrite">
          “{{ formatComment(canteen.rant, 38).text }}”
          <span>（{{ formatComment(canteen.rant, 38).length }}字）</span>
        </p>
        <figure class="canteen-intro__photo-frame">
          <img
            class="canteen-intro__photo"
            :src="canteen.image"
            :alt="`${canteen.name} canteen photo`"
            loading="lazy"
          />
        </figure>
        <button class="button-ink is-primary" type="button" @click="jumpToDishList(canteen.id)">
          去看菜品列表
        </button>
      </aside>
    </article>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { formatComment } from '../../utils/commentText';
import { getRatingLabel } from '../../utils/ratingLabel';

defineOptions({
  name: 'CanteenIntroGrid',
});

const props = defineProps({
  canteens: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();

function jumpToDishList(canteenId) {
  router.push({
    name: 'dishList',
    params: { canteenId },
  });
}
</script>

<style scoped lang="scss">
.canteen-intro {
  margin-top: var(--ft-space-4);
  display: grid;
  gap: var(--ft-space-2);
}

.canteen-intro__header {
  margin-bottom: 4px;
}

.canteen-intro__item {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  gap: 0;
}

.canteen-intro__item.is-left-heavy {
  grid-template-columns: 1.28fr 0.72fr;
}

.canteen-intro__item.is-right-heavy {
  grid-template-columns: 0.8fr 1.2fr;
}

.canteen-intro__main {
  padding: 18px 20px;
}

.canteen-intro__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.canteen-intro__line h3 {
  margin: 0;
  font-family: var(--ft-font-family-title);
  font-size: 36px;
  font-weight: 900;
}

.canteen-intro__score {
  margin: 6px 0 0;
  color: var(--ft-color-primary);
  font-family: var(--ft-font-family-title);
  font-size: 26px;
  font-weight: 900;
}

.canteen-intro__facts {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.canteen-intro__facts p {
  margin: 0;
  font-size: 13px;
  color: var(--ft-color-text-muted);
}

.canteen-intro__grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.canteen-intro__grid h4 {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.06em;
  color: var(--ft-color-secondary);
}

.canteen-intro__grid ul {
  margin: 6px 0 0;
  padding-left: 18px;
}

.canteen-intro__grid li {
  margin-bottom: 4px;
  color: var(--ft-color-secondary-soft);
}

.canteen-intro__intro-blocks {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.canteen-intro__block {
  border: 1px dashed rgb(58 36 24 / 35%);
  background: rgb(241 236 226 / 55%);
  padding: 8px 10px;
}

.canteen-intro__block h5 {
  margin: 0;
  font-size: 14px;
  color: var(--ft-color-secondary);
}

.canteen-intro__block p {
  margin: 4px 0 0;
  color: var(--ft-color-secondary-soft);
}

.canteen-intro__side {
  border-left: 1px dashed rgb(58 36 24 / 35%);
  padding: 16px;
  background: var(--ft-color-surface-ink);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
}

.canteen-intro__rant {
  margin: 0;
  font-size: 26px;
  color: var(--ft-color-primary);
}

.canteen-intro__rant span {
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.canteen-intro__photo-frame {
  margin: 0;
  border: 1px solid var(--ft-color-secondary);
  background: #fff;
  padding: 8px 8px 16px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 16%);
}

.canteen-intro__photo {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

@media (max-width: 980px) {
  .canteen-intro__item.is-left-heavy,
  .canteen-intro__item.is-right-heavy {
    grid-template-columns: 1fr;
  }

  .canteen-intro__side {
    border-left: 0;
    border-top: 1px dashed rgb(58 36 24 / 35%);
  }

  .canteen-intro__facts,
  .canteen-intro__grid {
    grid-template-columns: 1fr;
  }

  .canteen-intro__photo {
    aspect-ratio: 16 / 9;
  }
}
</style>
