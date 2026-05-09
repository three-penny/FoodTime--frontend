<!-- @author XXXXX -->

<template>
  <section class="rant-wall-view">
    <div class="section-rule">
      <span class="section-rule__index">10</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="rant-wall-header torn-edge">
      <span class="sticker sticker--r-1">今日吐槽墙</span>
      <h1>今天食堂发生了什么</h1>
      <p class="handwrite">浏览同学们的实时吐槽，也可以把自己的观察贴上来。</p>
    </header>

    <article class="rant-compose torn-edge">
      <h2>上传我的吐槽</h2>
      <form class="rant-form" @submit.prevent="handleSubmit">
        <label>
          <span>关联食堂</span>
          <select v-model="form.canteenId">
            <option value="">请选择食堂</option>
            <option v-for="canteen in canteens" :key="canteen.id" :value="canteen.id">
              {{ canteen.name }}
            </option>
          </select>
        </label>
        <label>
          <span>吐槽标签</span>
          <select v-model="form.tag">
            <option value="排队">排队</option>
            <option value="口味">口味</option>
            <option value="价格">价格</option>
            <option value="服务">服务</option>
            <option value="环境">环境</option>
            <option value="其他">其他</option>
          </select>
        </label>
        <label class="rant-form__content">
          <span>吐槽内容</span>
          <textarea
            v-model.trim="form.content"
            maxlength="180"
            rows="4"
            placeholder="写下今天真实遇到的排队、口味、价格或服务情况。"
          ></textarea>
        </label>
        <p v-if="message" class="rant-form__message">{{ message }}</p>
        <button class="button-ink is-primary" type="submit">贴到吐槽墙</button>
      </form>
    </article>

    <section class="rant-list" data-test="rant-list">
      <article
        v-for="(rant, index) in rants"
        :key="rant.id"
        class="rant-card torn-edge"
        :class="`is-note-${index % 3}`"
      >
        <div class="rant-card__meta">
          <span>{{ rant.createdAt }}</span>
          <span>{{ rant.tag }}</span>
          <span>{{ rant.canteenName }}</span>
        </div>
        <p>{{ rant.content }}</p>
        <strong class="handwrite">{{ rant.author }}</strong>
      </article>
    </section>
  </section>
</template>

<script setup>
/**
 * RantWallView
 * 职责：展示今日用户吐槽墙，并提供普通用户发布吐槽的入口。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：首页吐槽墙入口跳转后的浏览与发布页面。
 * 依赖：Pinia、Vue Router、useRantStore、useCanteenStore、useAuthStore。
 * 设计说明：当前阶段写入前端状态，模拟实时吐槽墙追加效果。
 */
import { computed, reactive, ref } from 'vue';
import { useAuthStore } from '../../store/useAuthStore';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useRantStore } from '../../store/useRantStore';

defineOptions({
  name: 'RantWallView',
});

const authStore = useAuthStore();
const canteenStore = useCanteenStore();
const rantStore = useRantStore();
const message = ref('');
const form = reactive({
  canteenId: '',
  tag: '排队',
  content: '',
});

const canteens = computed(() => canteenStore.canteens);
const rants = computed(() => rantStore.rants);
const selectedCanteen = computed(() =>
  canteenStore.getCanteenById(form.canteenId)
);

function resetForm() {
  form.canteenId = '';
  form.tag = '排队';
  form.content = '';
}

function handleSubmit() {
  if (!selectedCanteen.value) {
    message.value = '请选择关联食堂。';
    return;
  }

  if (!form.content) {
    message.value = '请填写吐槽内容。';
    return;
  }

  rantStore.createRant({
    canteenId: selectedCanteen.value.id,
    canteenName: selectedCanteen.value.name,
    tag: form.tag,
    content: form.content,
    author: authStore.displayName,
  });
  message.value = '';
  resetForm();
}
</script>

<style scoped lang="scss">
.rant-wall-view {
  min-width: 0;
}

.rant-wall-header,
.rant-compose,
.rant-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
}

.rant-wall-header {
  padding: clamp(18px, 4vw, 34px);
}

.rant-wall-header h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}

.rant-wall-header p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}

.rant-compose {
  margin-top: var(--ft-space-3);
  padding: 18px;
  background: var(--zine-paper-card-alt);
}

.rant-compose h2 {
  margin: 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
}

.rant-form {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.rant-form label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.rant-form__content {
  grid-column: 1 / -1;
}

.rant-form select,
.rant-form textarea {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.rant-form textarea {
  resize: vertical;
}

.rant-form__message {
  margin: 0;
  color: var(--zine-stamp-red);
}

.rant-list {
  margin-top: var(--ft-space-3);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.rant-card {
  padding: 16px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.rant-card.is-note-1 {
  transform: rotate(0.7deg);
}

.rant-card.is-note-2 {
  transform: rotate(-0.6deg);
}

.rant-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rant-card__meta span {
  border: 1px solid currentColor;
  color: var(--zine-stamp-red);
  padding: 2px 7px;
  font-size: 12px;
}

.rant-card p {
  margin: 12px 0 0;
  color: var(--ft-color-secondary-soft);
}

.rant-card strong {
  display: block;
  margin-top: 10px;
  color: var(--ft-color-primary);
  font-size: 22px;
}

@media (max-width: 780px) {
  .rant-form,
  .rant-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .rant-wall-header,
  .rant-compose,
  .rant-card {
    padding: 16px;
  }

  .rant-wall-header h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .rant-wall-header p {
    font-size: 22px;
  }

  .rant-compose h2 {
    font-size: 30px;
  }

  .rant-form .button-ink {
    width: 100%;
  }

  .rant-card {
    transform: none;
  }
}
</style>
