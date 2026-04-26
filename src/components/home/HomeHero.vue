<!-- @author Codex -->

<template>
  <section class="hero torn-edge" data-test="home-hero">
    <div class="hero__left">
      <span class="sticker sticker--r-2">食堂日志 · 2026</span>
      <h1 class="hero__title">北交干饭吧</h1>
      <p class="hero__slogan handwrite">把每次排队、踩雷和真香都记下来。</p>
      <div class="hero__actions">
        <button class="button-ink hero__action is-primary" type="button" @click="emit('review')">
          我要点评
        </button>
        <button class="button-ink hero__action" type="button" @click="emit('recommend')">
          美食推荐
        </button>
      </div>
    </div>

    <aside class="hero__right">
      <p class="hero__small">BEIJIAO CANTEEN FIELD NOTES</p>
      <p class="hero__desc">
        这不是餐饮官网，是一群爱吃饭的同学在记笔记。我们关心排队时长、阿姨手抖程度、
        周几最稳以及“今天值得冲吗”。
      </p>
      <p class="hero__desc">
        每条推荐都保留原始情绪，评分之外还有“必吃 / 推荐 / 再议 / 踩雷”印章，方便你 30 秒做决定。
      </p>
      <span class="sticker sticker--r2 hero__sticker">今日推荐已更新</span>
    </aside>

    <svg class="hero__decor hero__decor--chopsticks" viewBox="0 0 140 60" aria-hidden="true">
      <path class="decor-svg" d="M8 12l116 34M20 6l112 32" />
    </svg>
    <svg class="hero__decor hero__decor--aunt" viewBox="0 0 90 90" aria-hidden="true">
      <circle class="decor-svg" cx="46" cy="22" r="10" />
      <path class="decor-svg" d="M24 64c10-15 34-15 44 0M46 32v26M34 44h24" />
    </svg>
  </section>
</template>

<script setup>
defineOptions({
  name: 'HomeHero',
});

const emit = defineEmits(['review', 'recommend']);
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  min-height: 430px;
  overflow: hidden;
}

.hero__left {
  padding: clamp(26px, 6vw, 62px);
}

.hero__title {
  margin: 12px 0 0;
  font-family: var(--ft-font-family-title);
  font-size: var(--ft-font-size-2xl);
  line-height: 0.88;
  letter-spacing: 0.03em;
  font-weight: 900;
  width: min(760px, 92%);
}

.hero__slogan {
  margin: 22px 0 0;
  font-size: clamp(20px, 2.5vw, 32px);
  color: var(--ft-color-primary);
}

.hero__actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.hero__action {
  min-width: 150px;
  min-height: 62px;
  padding: 16px 28px;
  font-family: var(--ft-font-family-title);
  font-size: 22px;
  box-shadow: 4px 4px 0 var(--ft-color-secondary);
}

.hero__action:hover {
  box-shadow: 7px 7px 0 var(--ft-color-secondary);
}

.hero__right {
  border-left: 1px dashed rgb(58 36 24 / 35%);
  padding: 36px 24px 24px;
  background: rgb(241 236 226 / 64%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero__small {
  margin: 0;
  letter-spacing: 0.16em;
  font-size: 12px;
  color: var(--ft-color-text-muted);
}

.hero__desc {
  margin: 14px 0 0;
  column-count: 1;
  line-height: 1.8;
  color: var(--ft-color-secondary-soft);
}

.hero__sticker {
  margin-top: 18px;
  align-self: flex-start;
}

.hero__decor {
  position: absolute;
  opacity: 0.4;
  pointer-events: none;
}

.hero__decor--chopsticks {
  width: 128px;
  right: 24px;
  top: 12px;
  transform: rotate(-9deg);
}

.hero__decor--aunt {
  width: 86px;
  right: 30px;
  bottom: 20px;
  transform: rotate(7deg);
}

@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero__right {
    border-left: 0;
    border-top: 1px dashed rgb(58 36 24 / 35%);
  }
}
</style>
