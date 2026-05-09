<!-- @author XXXXX -->

<template>
  <section class="profile-view">
    <div class="section-rule">
      <span class="section-rule__index">07</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="profile-hero torn-edge">
      <div class="profile-hero__identity">
        <span class="sticker sticker--r-1">我的档案</span>
        <h1>{{ authStore.displayName }}</h1>
        <p class="handwrite">
          {{ roleLabel }} · 查看积分、签到记录和积分获取明细。
        </p>
      </div>

      <div class="points-stamp" aria-label="当前积分">
        <strong>{{ pointsStore.currentUserPoints }}</strong>
        <span>积分</span>
      </div>
    </header>

    <section class="profile-grid">
      <article class="points-panel torn-edge">
        <div class="points-panel__head">
          <span class="sticker sticker--r1">积分等级</span>
          <strong>{{ pointsStore.currentUserLevel.name }}</strong>
        </div>

        <div class="level-track" aria-hidden="true">
          <span :style="{ width: `${levelProgress}%` }"></span>
        </div>

        <p>
          距离下一等级还差
          <strong>{{ nextLevelGap }}</strong>
          分。
        </p>

        <button
          class="button-ink is-primary"
          type="button"
          :disabled="isCheckedInToday"
          @click="handleCheckIn"
        >
          {{ checkInButtonText }}
        </button>
      </article>

      <article class="stats-panel torn-edge">
        <span class="sticker sticker--r-2">积分统计</span>
        <div class="stats-grid">
          <div>
            <strong>{{ pointsStore.currentUserStats.checkInDays }}</strong>
            <span>签到天数</span>
          </div>
          <div>
            <strong>{{ pointsStore.currentUserStats.reviewCount }}</strong>
            <span>点评奖励</span>
          </div>
          <div>
            <strong>{{ pointsStore.currentUserStats.uploadCount }}</strong>
            <span>投稿奖励</span>
          </div>
        </div>
      </article>
    </section>

    <section class="profile-detail-grid">
      <article class="history-panel torn-edge">
        <div class="panel-title">
          <span class="sticker sticker--r-1">积分明细</span>
          <h2>最近记录</h2>
        </div>

        <div v-if="pointsStore.currentUserHistory.length === 0" class="empty-state">
          还没有积分记录，签到、点评和投稿通过后都会写到这里。
        </div>

        <div v-else class="history-list">
          <div
            v-for="record in pointsStore.currentUserHistory"
            :key="record.id"
            class="history-item"
          >
            <div>
              <strong>{{ record.reason }}</strong>
              <span>{{ record.timestamp }}</span>
            </div>
            <em :class="{ 'is-negative': record.amount.startsWith('-') }">
              {{ record.amount }}
            </em>
          </div>
        </div>
      </article>

      <article class="rules-panel torn-edge">
        <div class="panel-title">
          <span class="sticker sticker--r2">积分规则</span>
          <h2>如何获得积分</h2>
        </div>

        <ul class="rules-list">
          <li v-for="rule in pointRules" :key="rule.title">
            <span>{{ rule.points }}</span>
            <div>
              <strong>{{ rule.title }}</strong>
              <p>{{ rule.description }}</p>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
/**
 * ProfileView
 * 职责：展示当前用户的个人信息、积分总览、签到状态和积分明细。
 * 使用场景：顶部头像入口进入“我的”页面。
 * 依赖：Pinia、useAuthStore、usePointsStore。
 */
import { computed } from 'vue';
import { useAuthStore } from '../../store/useAuthStore';
import { usePointsStore } from '../../store/usePointsStore';

defineOptions({
  name: 'ProfileView',
});

const authStore = useAuthStore();
const pointsStore = usePointsStore();

const pointRules = [
  {
    title: '每日签到',
    points: '+5',
    description: '每天首次进入个人中心后可以签到一次。',
  },
  {
    title: '发表点评',
    points: '+10',
    description: '对菜品发表有效点评后获得积分。',
  },
  {
    title: '菜品投稿',
    points: '+20',
    description: '提交新菜品并通过管理员审核后发放。',
  },
  {
    title: '吐槽发布',
    points: '+3',
    description: '吐槽内容审核通过后计入积分。',
  },
];

const roleLabel = computed(() =>
  authStore.currentRole === 'admin' ? '管理员' : '普通用户'
);

const isCheckedInToday = computed(() => {
  const today = new Date().toLocaleDateString('zh-CN');
  const lastCheckIn = pointsStore.currentUserHistory.find(
    item => item.type === 'daily'
  );

  if (!lastCheckIn) {
    return false;
  }

  return new Date(lastCheckIn.timestamp).toLocaleDateString('zh-CN') === today;
});

const checkInButtonText = computed(() =>
  isCheckedInToday.value ? '今日已签到' : '每日签到 +5'
);

const nextLevelGap = computed(() => {
  const points = pointsStore.currentUserPoints;

  if (points >= 1000) {
    return 0;
  }
  if (points >= 500) {
    return 1000 - points;
  }
  if (points >= 200) {
    return 500 - points;
  }
  return 200 - points;
});

const levelProgress = computed(() => {
  const points = pointsStore.currentUserPoints;
  const nextTarget =
    points >= 1000 ? 1000 : points >= 500 ? 1000 : points >= 200 ? 500 : 200;
  const previousTarget = points >= 500 ? 500 : points >= 200 ? 200 : 0;
  const span = nextTarget - previousTarget || 1;

  return Math.min(100, Math.round(((points - previousTarget) / span) * 100));
});

function handleCheckIn() {
  pointsStore.dailyCheckIn();
}
</script>

<style scoped lang="scss">
.profile-view {
  min-width: 0;
}

.profile-hero,
.points-panel,
.stats-panel,
.history-panel,
.rules-panel {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
}

.profile-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  padding: clamp(18px, 4vw, 34px);
}

.profile-hero h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(50px, 7vw, 90px);
  line-height: 0.9;
}

.profile-hero p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.points-stamp {
  width: 128px;
  height: 128px;
  border: 3px double var(--zine-stamp-blue);
  border-radius: 50%;
  display: grid;
  place-items: center;
  align-content: center;
  color: var(--zine-stamp-blue);
  background: var(--zine-stamp-blue-soft);
  transform: rotate(-6deg);
  mix-blend-mode: multiply;
}

.points-stamp strong {
  font-family: var(--zine-title-font);
  font-size: 42px;
  line-height: 1;
}

.points-stamp span {
  font-weight: 800;
  letter-spacing: 0.08em;
}

.profile-grid,
.profile-detail-grid {
  display: grid;
  gap: 16px;
  margin-top: var(--ft-space-3);
}

.profile-grid {
  grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
}

.profile-detail-grid {
  grid-template-columns: minmax(0, 1fr) minmax(280px, 0.82fr);
  align-items: start;
}

.points-panel,
.stats-panel,
.history-panel,
.rules-panel {
  padding: 18px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.points-panel {
  background: var(--zine-paper-card-alt);
}

.points-panel__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.points-panel__head strong {
  font-family: var(--zine-title-font);
  font-size: 34px;
  color: var(--ft-color-primary);
}

.level-track {
  height: 14px;
  border: 1px solid var(--ft-color-secondary);
  background: rgb(255 250 240 / 74%);
  margin-top: 16px;
  overflow: hidden;
}

.level-track span {
  display: block;
  height: 100%;
  background:
    repeating-linear-gradient(
      -45deg,
      rgb(183 47 28 / 88%) 0 8px,
      rgb(183 47 28 / 64%) 8px 15px
    );
}

.points-panel p {
  margin: 12px 0 14px;
  color: var(--ft-color-secondary-soft);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.stats-grid div {
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 62%);
  padding: 12px;
}

.stats-grid strong {
  display: block;
  font-family: var(--zine-title-font);
  font-size: 32px;
  line-height: 1;
  color: var(--ft-color-primary);
}

.stats-grid span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.panel-title h2 {
  margin: 12px 0 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
  line-height: 1;
}

.empty-state {
  margin-top: 16px;
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 62%);
  color: var(--ft-color-text-muted);
  padding: 18px;
}

.history-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px dashed rgb(58 36 24 / 24%);
  padding-bottom: 10px;
}

.history-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.history-item div {
  min-width: 0;
}

.history-item strong,
.rules-list strong {
  display: block;
  color: var(--ft-color-secondary);
}

.history-item span,
.rules-list p {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.history-item em {
  color: var(--ft-color-accent);
  font-family: var(--zine-title-font);
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
}

.history-item em.is-negative {
  color: var(--zine-stamp-red);
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 12px;
}

.rules-list li {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.rules-list li > span {
  border: 2px solid var(--zine-stamp-red);
  color: var(--zine-stamp-red);
  background: var(--zine-stamp-red-soft);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  font-weight: 900;
  transform: rotate(-3deg);
}

.rules-list p {
  margin: 3px 0 0;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

@media (max-width: 860px) {
  .profile-hero,
  .profile-grid,
  .profile-detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .profile-hero,
  .points-panel,
  .stats-panel,
  .history-panel,
  .rules-panel {
    padding: 16px;
  }

  .profile-hero h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .profile-hero p {
    font-size: 22px;
  }

  .points-stamp {
    width: 104px;
    height: 104px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .points-panel .button-ink {
    width: 100%;
  }
}
</style>
