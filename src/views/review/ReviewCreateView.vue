<!-- @author Codex -->

<template>
  <section class="review-view">
    <div class="section-rule">
      <span class="section-rule__index">08</span>
      <span class="section-rule__line"></span>
    </div>

    <article class="review-paper torn-edge">
      <div class="review-paper__main">
        <span class="sticker sticker--r-1">点评投稿</span>
        <h1>把今天这顿饭记下来</h1>
        <p class="review-paper__lead handwrite">
          写窗口、写排队、写阿姨手抖，也写那一口到底值不值。
        </p>

        <form class="review-form">
          <label>
            <span>食堂 / 窗口</span>
            <input type="text" placeholder="例如：学苑餐厅 · 面食窗口" />
          </label>
          <label>
            <span>菜品名称</span>
            <input type="text" placeholder="例如：红烧牛肉面" />
          </label>
          <label>
            <span>这顿怎么说</span>
            <textarea rows="5" placeholder="可以写长一点，别只写好吃。" maxlength="180"></textarea>
          </label>
          <div class="review-form__actions">
            <button class="button-ink is-primary" type="button">盖章保存</button>
            <button class="button-ink" type="button" @click="goHome">先回首页</button>
          </div>
        </form>
      </div>

      <aside class="review-note">
        <p class="handwrite">评分标签规则</p>
        <ul>
          <li>4.5 以上：必吃</li>
          <li>4.0 以上：推荐</li>
          <li>3.0 以上：再议</li>
          <li>3.0 以下：踩雷</li>
        </ul>
      </aside>
    </article>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ReviewCreateView',
});

const router = useRouter();

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}
</script>

<style scoped lang="scss">
.review-view {
  min-width: 0;
}

.review-paper {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 22px;
  padding: clamp(20px, 4vw, 40px);
}

.review-paper__main h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}

.review-paper__lead {
  margin: 16px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}

.review-form {
  margin-top: 24px;
  display: grid;
  gap: 14px;
}

.review-form label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.review-form input,
.review-form textarea {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.review-form textarea {
  resize: vertical;
}

.review-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.review-note {
  align-self: start;
  border: 1px dashed var(--ft-color-secondary);
  background: var(--zine-paper-card-alt);
  padding: 18px;
  transform: rotate(1.4deg);
}

.review-note p {
  margin: 0;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.review-note ul {
  margin: 12px 0 0;
  padding-left: 20px;
  color: var(--ft-color-secondary-soft);
}

@media (max-width: 860px) {
  .review-paper {
    grid-template-columns: 1fr;
  }
}
</style>
