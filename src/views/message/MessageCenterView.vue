<!-- @author Codex -->

<template>
  <section class="message-view">
    <div class="section-rule">
      <span class="section-rule__index">09</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="message-view__header">
      <span class="sticker sticker--r-1">消息墙</span>
      <h1>今日食堂消息</h1>
      <p class="handwrite">把排队、补货、避雷和夜宵消息都钉在这一页。</p>
    </header>

    <div class="message-list">
      <article
        v-for="(message, index) in messages"
        :key="message.id"
        class="message-card torn-edge"
        :class="`is-note-${index % 3}`"
      >
        <span class="message-card__time">{{ message.time }}</span>
        <span class="message-card__tag">{{ message.tag }}</span>
        <h2>{{ message.title }}</h2>
        <p>{{ message.content }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { CANTEEN_MESSAGES } from '../../constants/messages';

defineOptions({
  name: 'MessageCenterView',
});

const messages = CANTEEN_MESSAGES;
</script>

<style scoped lang="scss">
.message-view {
  min-width: 0;
}

.message-view__header {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: clamp(18px, 4vw, 34px);
  box-shadow: 5px 6px 0 rgb(58 36 24 / 10%);
}

.message-view__header h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 88px);
  line-height: 0.9;
}

.message-view__header p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}

.message-list {
  margin-top: var(--ft-space-3);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.message-card {
  position: relative;
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card-alt);
  padding: 18px 18px 20px;
  min-height: 180px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.message-card::before {
  content: '';
  position: absolute;
  top: -16px;
  left: 22px;
  width: 100px;
  height: 28px;
  background: var(--zine-decor-tape-blue) center / contain no-repeat;
  opacity: 0.74;
  mix-blend-mode: multiply;
}

.message-card.is-note-1 {
  transform: rotate(0.8deg);
}

.message-card.is-note-2 {
  transform: rotate(-0.7deg);
}

.message-card__time,
.message-card__tag {
  display: inline-flex;
  margin-right: 8px;
  border: 1px solid currentColor;
  padding: 2px 7px;
  color: var(--zine-stamp-red);
  font-size: 12px;
}

.message-card h2 {
  margin: 14px 0 0;
  font-family: var(--zine-title-font);
  font-size: 30px;
  line-height: 1.05;
}

.message-card p {
  margin: 10px 0 0;
  color: var(--ft-color-secondary-soft);
}

@media (max-width: 760px) {
  .message-list {
    grid-template-columns: 1fr;
  }
}
</style>
