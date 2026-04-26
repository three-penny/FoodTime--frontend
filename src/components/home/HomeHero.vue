<!-- @author Codex -->

<template>
  <section class="hero hero--wave-top" data-test="home-hero">
    <div class="hero__left">
      <span class="sticker sticker--r-2">食堂日志 · 2026</span>
      <h1 class="hero__title">
        <span class="hero__title-line">北交</span>
        <span class="hero__title-line">干饭吧</span>
      </h1>
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
        这不是餐饮官网，是一群爱吃饭的同学的美食笔记。我们关心菜品口味、排队时长
        来决定“今天吃什么”
      </p>
      <p class="hero__desc">
        在北交，先吃饱再谈理想
      </p>
      <span class="sticker sticker--r2 hero__sticker">今日推荐已更新</span>
    </aside>

    <svg class="hero__decor hero__decor--chopsticks" viewBox="0 0 140 60" aria-hidden="true">
      <path class="decor-svg" d="M8 12l116 34M20 6l112 32" />
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
  --hero-wave-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 430' preserveAspectRatio='none'%3E%3Cpath fill='black' d='M0%2030%20C75%2012%20165%2012%20240%2030%20C315%2048%20405%2048%20480%2030%20C555%2012%20645%2012%20720%2030%20C795%2048%20885%2048%20960%2030%20C1035%2012%201125%2012%201200%2030%20L1200%20430%20L0%20430%20Z'/%3E%3C/svg%3E");
  position: relative;
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  min-height: 430px;
  overflow: hidden;
  box-shadow:
    0 12px 26px rgb(58 36 24 / 16%),
    0 2px 0 rgb(255 255 255 / 34%) inset;
}

.hero--wave-top {
  /* 回退：不支持 mask 时仍保留顶部波形轮廓 */
  clip-path: polygon(
    0 4.4%,
    5% 4.1%,
    10% 3.9%,
    15% 4%,
    20% 4.4%,
    25% 4.8%,
    30% 5.1%,
    35% 4.8%,
    40% 4.3%,
    45% 3.9%,
    50% 3.8%,
    55% 4.1%,
    60% 4.6%,
    65% 5%,
    70% 4.9%,
    75% 4.4%,
    80% 4%,
    85% 3.8%,
    90% 4.1%,
    95% 4.5%,
    100% 4.2%,
    100% 100%,
    0 100%
  );
}

@supports ((-webkit-mask-image: url("")) or (mask-image: url(""))) {
  .hero--wave-top {
    /* 主方案：SVG path 遮罩，曲线连续平滑且随容器等比缩放 */
    clip-path: none;
    -webkit-mask-image: var(--hero-wave-mask);
    mask-image: var(--hero-wave-mask);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: top center;
    mask-position: top center;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
  }
}

@media (hover: hover) {
  .hero--wave-top:hover {
    box-shadow:
      0 14px 30px rgb(58 36 24 / 19%),
      0 2px 0 rgb(255 255 255 / 36%) inset;
  }
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

.hero__title-line {
  display: block;
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
