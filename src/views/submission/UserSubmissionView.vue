<!-- @author XXXXX -->

<template>
  <section class="user-submission-view">
    <div class="section-rule">
      <span class="section-rule__index">13</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="submission-header">
      <span class="sticker sticker--r1">我的投稿</span>
      <h1>投稿进度</h1>
      <p class="handwrite">
        查看菜品是否已通过、被驳回，或还在等待审核同学盖章。
      </p>
      <button class="button-ink is-primary" type="button" @click="goUpload">
        上传新菜品
      </button>
    </header>

    <div class="submission-stats">
      <span>待审核 {{ submissionStore.pendingCount }}</span>
      <span>已通过 {{ submissionStore.approvedCount }}</span>
      <span>已驳回 {{ submissionStore.rejectedCount }}</span>
    </div>

    <div class="submission-list">
      <article
        v-for="item in submissions"
        :key="item.id"
        class="submission-card torn-edge"
      >
        <div>
          <span class="stamp">{{ statusLabel(item.status) }}</span>
          <h2>{{ item.dishName }}</h2>
          <p>{{ item.canteenName }} · {{ item.stallName }} · ¥{{ item.price }}</p>
        </div>
        <p class="submission-card__desc">{{ item.description }}</p>
        <div class="submission-card__meta">
          <span>{{ item.submittedAt }}</span>
          <span>{{ item.imageName }}</span>
          <span v-if="item.tags?.length">标签 {{ item.tags.join(' / ') }}</span>
        </div>
        <p v-if="item.reason" class="submission-card__reason">
          处理意见：{{ item.reason }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
/**
 * UserSubmissionView
 * 职责：展示当前用户菜品投稿记录和审核结果。
 * 作者：XXXXX
 * 使用场景：用户提交菜品后查看状态、继续新增投稿。
 * 依赖：Pinia、Vue Router、useSubmissionStore。
 */
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSubmissionStore } from '../../store/useSubmissionStore';

defineOptions({
  name: 'UserSubmissionView',
});

const router = useRouter();
const submissionStore = useSubmissionStore();
const submissions = computed(() => submissionStore.submissions);

function statusLabel(status) {
  return submissionStore.statusLabels[status] ?? '未知';
}

function goUpload() {
  router.push({ name: 'dishUpload' });
}
</script>

<style scoped lang="scss">
.user-submission-view {
  min-width: 0;
}

.submission-header {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: clamp(18px, 4vw, 34px);
}

.submission-header h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}

.submission-header p {
  margin: 14px 0 16px;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.submission-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: var(--ft-space-2);
}

.submission-stats span,
.submission-card__meta span {
  border: 1px dashed rgb(58 36 24 / 36%);
  background: rgb(255 250 240 / 62%);
  padding: 4px 10px;
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.submission-list {
  margin-top: var(--ft-space-3);
  display: grid;
  gap: 16px;
}

.submission-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card-alt);
  padding: 18px;
}

.submission-card h2 {
  margin: 14px 0 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
  line-height: 1;
}

.submission-card p {
  margin: 8px 0 0;
  color: var(--ft-color-secondary-soft);
}

.submission-card__desc {
  max-width: 820px;
}

.submission-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.submission-card__reason {
  color: var(--zine-stamp-red);
}

@media (max-width: 520px) {
  .submission-header,
  .submission-card {
    padding: 16px;
  }

  .submission-header h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .submission-header p {
    font-size: 22px;
  }

  .submission-card h2 {
    font-size: 30px;
  }

  .submission-header .button-ink {
    width: 100%;
  }
}
</style>
