<!-- @author XXXXX -->

<template>
  <section class="admin-audit-view">
    <div class="section-rule">
      <span class="section-rule__index">06</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="admin-hero torn-edge">
      <div>
        <span class="sticker sticker--r-1">管理员审核台</span>
        <h1>投稿、吐槽和评论发布审核</h1>
        <p class="handwrite">
          按照内容类型和状态快速处理用户提交的菜品、吐槽墙和评论内容。
        </p>
      </div>
      <div class="admin-hero__stamp">
        <strong>{{ pendingTotal }}</strong>
        <span>待处理</span>
      </div>
    </header>

    <section class="audit-summary" aria-label="审核统计">
      <button
        v-for="item in summaryCards"
        :key="item.key"
        class="audit-summary__card"
        :class="{ 'is-active': activePanel === item.key }"
        type="button"
        @click="activePanel = item.key"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.count }}</strong>
      </button>
    </section>

    <section class="audit-layout">
      <aside class="audit-filter torn-edge">
        <h2>筛选</h2>
        <label>
          <span>审核类型</span>
          <select v-model="activePanel">
            <option value="dish">菜品投稿</option>
            <option value="rant">吐槽墙</option>
            <option value="review">评论审核</option>
          </select>
        </label>
        <label>
          <span>审核状态</span>
          <select v-model="activeStatus">
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已驳回</option>
            <option value="all">全部</option>
          </select>
        </label>
        <label>
          <span>驳回意见模板</span>
          <textarea v-model.trim="rejectReason" rows="4"></textarea>
        </label>
      </aside>

      <div class="audit-board">
        <article
          v-for="item in activeItems"
          :key="item.id"
          class="audit-card torn-edge"
        >
          <div class="audit-card__head">
            <span class="stamp">{{ statusLabel(item.status) }}</span>
            <div>
              <h2>{{ itemTitle(item) }}</h2>
              <p>{{ itemMeta(item) }}</p>
            </div>
          </div>

          <p class="audit-card__content">{{ itemContent(item) }}</p>

          <div class="audit-card__tags">
            <span v-for="tag in itemTags(item)" :key="tag">{{ tag }}</span>
          </div>

          <img
            v-if="activePanel === 'dish' && item.imageUrl"
            :src="item.imageUrl"
            :alt="item.dishName"
            class="audit-card__image"
          />

          <p v-if="item.reason || item.audit_reason" class="audit-card__reason">
            处理意见：{{ item.reason || item.audit_reason }}
          </p>

          <div class="audit-card__actions">
            <button
              class="button-ink is-primary"
              type="button"
              :disabled="item.status === 'approved'"
              @click="approveItem(item)"
            >
              通过
            </button>
            <button
              class="button-ink"
              type="button"
              :disabled="item.status === 'rejected'"
              @click="rejectItem(item)"
            >
              驳回
            </button>
          </div>
        </article>

        <p v-if="activeItems.length === 0" class="audit-empty">
          当前筛选条件下暂无审核内容。
        </p>
      </div>
    </section>
  </section>
</template>

<script setup>
/**
 * AdminAuditView
 * 职责：提供管理员审核菜品投稿、吐槽墙和评论内容的前端工作台。
 * 依赖：Pinia、useSubmissionStore、useRantStore、useReviewStore。
 */
import { computed, onMounted, ref } from 'vue';
import { useRantStore } from '../../store/useRantStore';
import { useSubmissionStore } from '../../store/useSubmissionStore';
import { useReviewStore } from '../../store/useReviewStore';

defineOptions({
  name: 'AdminAuditView',
});

const submissionStore = useSubmissionStore();
const rantStore = useRantStore();
const reviewStore = useReviewStore();

onMounted(async () => {
  await Promise.all([
    submissionStore.loadAllSubmissions(),
    rantStore.loadRants(),
    reviewStore.loadAllReviews(),
  ]);
});

const activePanel = ref('dish');
const activeStatus = ref('pending');
const rejectReason = ref('信息不完整或内容不符合发布规范，请修改后重新提交。');

const pendingTotal = computed(
  () => submissionStore.pendingCount + rantStore.pendingCount + reviewStore.pendingCount
);

const summaryCards = computed(() => [
  {
    key: 'dish',
    label: '菜品待审',
    count: submissionStore.pendingCount,
  },
  {
    key: 'rant',
    label: '吐槽待审',
    count: rantStore.pendingCount,
  },
  {
    key: 'review',
    label: '评论待审',
    count: reviewStore.pendingCount,
  },
]);

const activeItems = computed(() => {
  let source;
  if (activePanel.value === 'dish') {
    source = submissionStore.submissions;
  } else if (activePanel.value === 'rant') {
    source = rantStore.rants;
  } else {
    source = reviewStore.reviews;
  }

  if (activeStatus.value === 'all') {
    return source;
  }

  return source.filter(item => item.status === activeStatus.value);
});

function statusLabel(status) {
  if (activePanel.value === 'dish') return submissionStore.statusLabels[status] ?? '未知';
  if (activePanel.value === 'rant') return rantStore.statusLabels[status] ?? '未知';
  return reviewStore.statusLabels[status] ?? '未知';
}

function itemTitle(item) {
  if (activePanel.value === 'dish') return item.dishName;
  if (activePanel.value === 'rant') return `${item.tag}吐槽`;
  return `点评 (${item.rating ?? 0} 星)`;
}

function itemMeta(item) {
  if (activePanel.value === 'dish') {
    return `${item.canteenName} / ${item.stallName} / ¥${item.price} / ${item.submitter}`;
  }
  if (activePanel.value === 'rant') {
    return `${item.canteenName} / ${item.author} / ${item.createdAt}`;
  }
  return `评分 ${item.rating ?? '?'} / 5 · ${item.reviewer_nickname || '用户'}`;
}

function itemContent(item) {
  if (activePanel.value === 'dish') return item.description;
  if (activePanel.value === 'rant') return item.content;
  return item.comment || '';
}

function itemTags(item) {
  if (activePanel.value === 'dish') {
    return (item.tags ?? []).filter(Boolean);
  }
  if (activePanel.value === 'rant') {
    return [item.tag, item.canteenName].filter(Boolean);
  }
  const dishPath = [
    item.canteen_name,
    item.stall_name,
    item.dish_name,
  ].filter(Boolean).join(' - ');
  return [`${item.rating} 星`, dishPath].filter(Boolean);
}

function approveItem(item) {
  if (activePanel.value === 'dish') {
    submissionStore.approveSubmission(item.id);
    return;
  }
  if (activePanel.value === 'rant') {
    rantStore.approveRant(item.id);
    return;
  }
  reviewStore.approveReview(item.id);
}

function rejectItem(item) {
  if (activePanel.value === 'dish') {
    submissionStore.rejectSubmission(item.id, rejectReason.value);
    return;
  }
  if (activePanel.value === 'rant') {
    rantStore.rejectRant(item.id, rejectReason.value);
    return;
  }
  reviewStore.rejectReview(item.id, rejectReason.value);
}
</script>

<style scoped lang="scss">
.admin-audit-view {
  min-width: 0;
}

.admin-hero,
.audit-filter,
.audit-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
}

.admin-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  padding: clamp(18px, 4vw, 34px);
}

.admin-hero h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(46px, 6.6vw, 82px);
  line-height: 0.9;
}

.admin-hero p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 25px;
}

.admin-hero__stamp {
  width: 120px;
  height: 120px;
  border: 3px double var(--zine-stamp-red);
  border-radius: 50%;
  display: grid;
  place-items: center;
  align-content: center;
  color: var(--zine-stamp-red);
  background: var(--zine-stamp-red-soft);
  transform: rotate(-7deg);
  mix-blend-mode: multiply;
}

.admin-hero__stamp strong {
  font-family: var(--zine-title-font);
  font-size: 42px;
  line-height: 1;
}

.audit-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: var(--ft-space-3);
}

.audit-summary__card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card-alt);
  color: var(--ft-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  font: inherit;
  text-align: left;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 18%);
}

.audit-summary__card.is-active {
  border-color: var(--ft-color-primary);
  color: var(--ft-color-primary);
  transform: rotate(-0.5deg);
}

.audit-summary__card strong {
  font-family: var(--zine-title-font);
  font-size: 34px;
  line-height: 1;
}

.audit-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 18px;
  margin-top: var(--ft-space-3);
  align-items: start;
}

.audit-filter {
  display: grid;
  gap: 14px;
  padding: 18px;
  background: var(--zine-paper-card-alt);
  position: sticky;
  top: 104px;
}

.audit-filter h2 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
}

.audit-filter label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.audit-filter select,
.audit-filter textarea {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 11px 12px;
  outline: none;
}

.audit-board {
  display: grid;
  gap: 16px;
}

.audit-card {
  padding: 18px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.audit-card__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.audit-card h2 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: 36px;
  line-height: 1;
}

.audit-card p {
  margin: 8px 0 0;
  color: var(--ft-color-secondary-soft);
}

.audit-card__content {
  max-width: 780px;
}

.audit-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.audit-card__tags span {
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 62%);
  padding: 4px 10px;
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.audit-card__image {
  display: block;
  margin-top: 14px;
  max-width: 320px;
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  border-radius: 4px;
}

.audit-card__reason {
  color: var(--zine-stamp-red);
}

.audit-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.audit-card__actions button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.audit-empty {
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 60%);
  color: var(--ft-color-text-muted);
  margin: 0;
  padding: 18px;
}

@media (max-width: 860px) {
  .admin-hero,
  .audit-layout {
    grid-template-columns: 1fr;
  }

  .audit-filter {
    position: static;
  }
}

@media (max-width: 560px) {
  .admin-hero,
  .audit-filter,
  .audit-card {
    padding: 16px;
  }

  .admin-hero h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .admin-hero p {
    font-size: 22px;
  }

  .admin-hero__stamp {
    width: 96px;
    height: 96px;
  }

  .audit-summary {
    grid-template-columns: 1fr;
  }

  .audit-card__head {
    grid-template-columns: 1fr;
  }

  .audit-card h2 {
    font-size: 30px;
  }

  .audit-card__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
