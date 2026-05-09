<!-- @author XXXXX -->

<template>
  <section class="profile-view">
    <div class="section-rule">
      <span class="section-rule__index">07</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="profile-header torn-edge">
      <div>
        <span class="sticker sticker--r-1">我的</span>
        <h1>个人中心</h1>
        <p class="handwrite">管理账号资料、查看积分流水和个人投稿入口。</p>
      </div>
      <span class="profile-header__mark" aria-hidden="true">FOODTIME</span>
    </header>

    <section class="profile-layout">
      <aside class="profile-card torn-edge">
        <div class="avatar-stamp">{{ avatarText }}</div>
        <h2>{{ nickname }}</h2>
        <p>{{ roleLabel }}</p>

        <dl class="identity-list">
          <div>
            <dt>账号</dt>
            <dd>{{ account }}</dd>
          </div>
          <div>
            <dt>昵称</dt>
            <dd>{{ nickname }}</dd>
          </div>
          <div>
            <dt>身份</dt>
            <dd>{{ roleLabel }}</dd>
          </div>
        </dl>
      </aside>

      <article class="profile-panel torn-edge">
        <nav class="profile-tabs" aria-label="个人中心选项">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            :class="{ 'is-active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <span>{{ tab.index }}</span>
            {{ tab.label }}
          </button>
        </nav>

        <section v-if="activeTab === 'account'" class="tab-section">
          <div class="panel-title">
            <span class="sticker sticker--r1">账号信息</span>
            <h2>基础资料</h2>
          </div>

          <div class="info-grid">
            <div v-for="item in accountInfo" :key="item.label">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'points'" class="tab-section">
          <div class="panel-title">
            <span class="sticker sticker--r-2">积分</span>
            <h2>积分明细</h2>
          </div>

          <div class="points-summary">
            <div>
              <span>当前积分</span>
              <strong>{{ pointsStore.currentUserPoints }}</strong>
            </div>
            <div>
              <span>获得积分</span>
              <strong>+{{ pointsStore.currentUserStats.earnedPoints }}</strong>
            </div>
            <div>
              <span>使用积分</span>
              <strong>-{{ pointsStore.currentUserStats.spentPoints }}</strong>
            </div>
          </div>

          <div class="point-actions">
            <button
              class="button-ink is-primary"
              type="button"
              :disabled="isCheckedInToday"
              @click="handleCheckIn"
            >
              {{ checkInButtonText }}
            </button>
            <button
              class="button-ink"
              type="button"
              :disabled="pointsStore.currentUserPoints < 20"
              @click="handleExchange"
            >
              兑换优惠券 -20
            </button>
          </div>

          <div class="ledger-grid">
            <section>
              <h3>获得来源</h3>
              <div v-if="earnedRecords.length === 0" class="empty-state">
                暂无获得记录。
              </div>
              <div v-else class="ledger-list">
                <div v-for="record in earnedRecords" :key="record.id">
                  <div>
                    <strong>{{ record.reason }}</strong>
                    <span>{{ record.timestamp }}</span>
                  </div>
                  <em>{{ record.amount }}</em>
                </div>
              </div>
            </section>

            <section>
              <h3>使用来源</h3>
              <div v-if="spentRecords.length === 0" class="empty-state">
                暂无使用记录。
              </div>
              <div v-else class="ledger-list">
                <div v-for="record in spentRecords" :key="record.id">
                  <div>
                    <strong>{{ record.reason }}</strong>
                    <span>{{ record.timestamp }}</span>
                  </div>
                  <em class="is-negative">{{ record.amount }}</em>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section v-else class="tab-section">
          <div class="panel-title">
            <span class="sticker sticker--r2">常用入口</span>
            <h2>我的内容</h2>
          </div>
          <div class="quick-actions">
            <button class="button-ink" type="button" @click="goSubmissions">
              查看投稿进度
            </button>
            <button class="button-ink" type="button" @click="goUpload">
              上传新菜品
            </button>
          </div>
        </section>
      </article>
    </section>
  </section>
</template>

<script setup>
/**
 * ProfileView
 * 职责：展示个人中心账号资料，并提供积分明细等独立选项。
 * 依赖：Pinia、Vue Router、useAuthStore、usePointsStore。
 */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/useAuthStore';
import { usePointsStore } from '../../store/usePointsStore';

defineOptions({
  name: 'ProfileView',
});

const router = useRouter();
const authStore = useAuthStore();
const pointsStore = usePointsStore();
const activeTab = ref('account');

const tabs = [
  { key: 'account', index: '01', label: '账号信息' },
  { key: 'points', index: '02', label: '积分明细' },
  { key: 'content', index: '03', label: '我的内容' },
];

const account = computed(() => authStore.session?.account || '未登录');
const nickname = computed(() => authStore.session?.nickname || account.value);
const roleLabel = computed(() =>
  authStore.currentRole === 'admin' ? '管理员' : '普通用户'
);
const avatarText = computed(() => nickname.value.slice(0, 1).toUpperCase());

const accountInfo = computed(() => [
  { label: '登录账号', value: account.value },
  { label: '显示昵称', value: nickname.value },
  { label: '账号身份', value: roleLabel.value },
  { label: '账号状态', value: '正常' },
]);

const earnedRecords = computed(() =>
  pointsStore.currentUserHistory.filter(item => item.amount.startsWith('+'))
);
const spentRecords = computed(() =>
  pointsStore.currentUserHistory.filter(item => item.amount.startsWith('-'))
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

function handleCheckIn() {
  pointsStore.dailyCheckIn();
}

function handleExchange() {
  pointsStore.consumePoints(20, '兑换食堂优惠券');
}

function goSubmissions() {
  router.push({ name: 'userSubmissions' });
}

function goUpload() {
  router.push({ name: 'dishUpload' });
}
</script>

<style scoped lang="scss">
.profile-view {
  min-width: 0;
}

.profile-header,
.profile-card,
.profile-panel {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: clamp(18px, 4vw, 34px);
}

.profile-header h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(50px, 7vw, 90px);
  line-height: 0.9;
}

.profile-header p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.profile-header__mark {
  border: 2px dashed var(--zine-stamp-blue);
  color: var(--zine-stamp-blue);
  background: var(--zine-stamp-blue-soft);
  font-family: var(--zine-title-font);
  font-weight: 900;
  padding: 18px 14px;
  transform: rotate(6deg);
  mix-blend-mode: multiply;
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
  gap: 18px;
  margin-top: var(--ft-space-3);
  align-items: start;
}

.profile-card,
.profile-panel {
  padding: 18px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.profile-card {
  background: var(--zine-paper-card-alt);
  position: sticky;
  top: 104px;
}

.avatar-stamp {
  width: 88px;
  height: 88px;
  border: 3px double var(--zine-stamp-red);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--zine-stamp-red);
  background: var(--zine-stamp-red-soft);
  font-family: var(--zine-title-font);
  font-size: 38px;
  font-weight: 900;
  transform: rotate(-6deg);
  mix-blend-mode: multiply;
}

.profile-card h2 {
  margin: 18px 0 0;
  font-family: var(--zine-title-font);
  font-size: 36px;
  line-height: 1;
}

.profile-card p {
  margin: 8px 0 0;
  color: var(--ft-color-text-muted);
}

.identity-list {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
}

.identity-list div,
.info-grid div,
.points-summary div {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 62%);
  padding: 10px 12px;
}

.identity-list dt,
.info-grid span,
.points-summary span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.identity-list dd {
  margin: 2px 0 0;
  color: var(--ft-color-secondary);
  font-weight: 800;
  overflow-wrap: anywhere;
}

.profile-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px dashed rgb(58 36 24 / 28%);
  padding-bottom: 12px;
}

.profile-tabs button {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  color: var(--ft-color-secondary);
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  padding: 9px 12px;
  box-shadow: 2px 2px 0 rgb(58 36 24 / 25%);
}

.profile-tabs button.is-active {
  border-color: var(--ft-color-primary);
  color: var(--ft-color-primary);
  transform: rotate(-1deg);
}

.profile-tabs span {
  margin-right: 6px;
  color: rgb(58 36 24 / 55%);
  font-size: 12px;
}

.tab-section {
  margin-top: 18px;
}

.panel-title h2 {
  margin: 12px 0 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
  line-height: 1;
}

.info-grid,
.points-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.info-grid strong,
.points-summary strong {
  display: block;
  margin-top: 2px;
  color: var(--ft-color-secondary);
  font-family: var(--zine-title-font);
  font-size: 26px;
  line-height: 1.1;
  overflow-wrap: anywhere;
}

.points-summary strong {
  color: var(--ft-color-primary);
  font-size: 34px;
}

.point-actions,
.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  transform: none;
}

.ledger-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.ledger-grid h3 {
  margin: 0 0 10px;
  font-family: var(--zine-title-font);
  font-size: 26px;
}

.ledger-list {
  display: grid;
  gap: 10px;
}

.ledger-list > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px dashed rgb(58 36 24 / 24%);
  padding-bottom: 10px;
}

.ledger-list > div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.ledger-list strong {
  display: block;
  color: var(--ft-color-secondary);
}

.ledger-list span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.ledger-list em {
  color: var(--ft-color-accent);
  font-family: var(--zine-title-font);
  font-size: 24px;
  font-style: normal;
  font-weight: 900;
}

.ledger-list em.is-negative {
  color: var(--zine-stamp-red);
}

.empty-state {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 62%);
  color: var(--ft-color-text-muted);
  padding: 14px;
}

@media (max-width: 860px) {
  .profile-header,
  .profile-layout,
  .ledger-grid {
    grid-template-columns: 1fr;
  }

  .profile-layout {
    display: grid;
  }

  .profile-card {
    position: static;
  }
}

@media (max-width: 560px) {
  .profile-header,
  .profile-card,
  .profile-panel {
    padding: 16px;
  }

  .profile-header {
    display: grid;
  }

  .profile-header h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .profile-header p {
    font-size: 22px;
  }

  .info-grid,
  .points-summary {
    grid-template-columns: 1fr;
  }

  .point-actions .button-ink,
  .quick-actions .button-ink {
    width: 100%;
  }
}
</style>
