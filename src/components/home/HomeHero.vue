<template>
  <section class="hero" data-test="home-hero">
    <div class="hero__content">
      <p class="hero__badge">北京交通大学 · 校园美食指南</p>
      <h1 class="hero__title">北交干饭吧</h1>
      <p class="hero__desc">
        食堂选择、菜品对比、评分推荐一屏搞定。先看热度，再做决定，每一餐都不踩雷。
      </p>
      <div class="hero__actions">
        <el-button type="primary" size="large" round @click="emit('review')">
          我要点评
        </el-button>
        <el-button size="large" round @click="emit('recommend')">
          美食推荐
        </el-button>
      </div>
    </div>
    <div class="hero__decor" aria-hidden="true">
      <div class="hero__circle hero__circle--one"></div>
      <div class="hero__circle hero__circle--two"></div>
    </div>
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
  overflow: hidden;
  border-radius: var(--ft-radius-lg);
  background: linear-gradient(145deg, #fff7ec 0%, #ffe7cd 60%, #ffd8b0 100%);
  box-shadow: var(--ft-shadow-lg);
  padding: clamp(24px, 5vw, 56px);
  min-height: 320px;
  display: flex;
  align-items: center;
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 620px;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  margin: 0 0 10px;
  padding: 8px 14px;
  border-radius: var(--ft-radius-pill);
  background: rgb(255 255 255 / 68%);
  color: var(--ft-color-secondary);
  font-weight: 600;
  font-size: var(--ft-font-size-sm);
}

.hero__title {
  margin: 0;
  font-size: var(--ft-font-size-2xl);
  line-height: 1.08;
  letter-spacing: 0.02em;
}

.hero__desc {
  margin: 18px 0 0;
  max-width: 520px;
  color: var(--ft-color-text-muted);
  line-height: 1.7;
}

.hero__actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero__decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);

  &--one {
    width: 280px;
    height: 280px;
    right: -70px;
    top: -50px;
    background: rgb(255 183 94 / 34%);
  }

  &--two {
    width: 210px;
    height: 210px;
    right: 120px;
    bottom: -100px;
    background: rgb(221 107 32 / 22%);
  }
}
</style>
