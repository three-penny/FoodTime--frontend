<!-- @author Codex -->

<template>
  <div class="app-shell">
    <div class="desk-decor desk-decor--torn-left" aria-hidden="true"></div>
    <div class="desk-decor desk-decor--note-left" aria-hidden="true"></div>
    <div class="desk-decor desk-decor--stamp-left" aria-hidden="true"></div>
    <div class="desk-decor desk-decor--stamp-right" aria-hidden="true"></div>
    <div class="desk-decor desk-decor--sketch-right" aria-hidden="true"></div>
    <div class="desk-decor desk-decor--tape-bottom" aria-hidden="true"></div>

    <AppHeader />
    <main class="app-main">
      <div class="app-page">
        <RouterView />
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
</script>

<style scoped lang="scss">
.app-shell {
  position: relative;
  min-height: 100vh;
  min-width: 0;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.app-main {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 36px 0 56px;
}

.app-page {
  --app-page-wave-height: clamp(24px, 3.2vw, 38px);
  --app-page-wave-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 56' preserveAspectRatio='none'%3E%3Cpath fill='black' d='M0 20 C75 6 165 6 240 20 C315 34 405 34 480 20 C555 6 645 6 720 20 C795 34 885 34 960 20 C1035 6 1125 6 1200 20 L1200 56 L0 56 Z'/%3E%3C/svg%3E");
  position: relative;
  width: min(100%, calc(var(--page-max-width) + var(--zine-page-padding) * 2));
  min-width: 0;
  margin: 0 auto;
  padding: 0 var(--zine-page-padding);
}

.app-page::before {
  content: '';
  position: absolute;
  inset: -24px 12px -34px;
  z-index: -1;
  border: 1px solid rgb(58 36 24 / 11%);
  background:
    linear-gradient(90deg, rgb(255 255 255 / 18%), transparent 10% 90%, rgb(58 36 24 / 5%)),
    radial-gradient(circle at 18% 12%, rgb(183 47 28 / 5%) 0, transparent 24%),
    var(--zine-paper-card);
  box-shadow:
    0 18px 48px var(--zine-paper-shadow),
    inset 0 0 80px rgb(58 36 24 / 5%);
  pointer-events: none;
}

@supports ((-webkit-mask-image: url("")) or (mask-image: url(""))) {
  .app-page::before {
    /* 顶部固定高度波浪：容器变高时振幅不被拉伸 */
    -webkit-mask:
      var(--app-page-wave-mask) top center / 100% var(--app-page-wave-height) no-repeat,
      linear-gradient(#000 0 0) bottom / 100% calc(100% - var(--app-page-wave-height) + 1px) no-repeat;
    mask:
      var(--app-page-wave-mask) top center / 100% var(--app-page-wave-height) no-repeat,
      linear-gradient(#000 0 0) bottom / 100% calc(100% - var(--app-page-wave-height) + 1px) no-repeat;
  }
}

.desk-decor {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  mix-blend-mode: multiply;
}

.desk-decor--torn-left {
  width: 260px;
  height: 120px;
  left: max(12px, calc((100vw - var(--page-max-width)) / 2 - 230px));
  top: 154px;
  background: var(--zine-decor-torn-edge) center / contain no-repeat;
  opacity: 0.36;
  transform: rotate(-7deg);
}

.desk-decor--note-left {
  width: 136px;
  height: 136px;
  left: max(18px, calc((100vw - var(--page-max-width)) / 2 - 148px));
  top: 36vh;
  background: var(--zine-decor-sticky-note) center / contain no-repeat;
  opacity: 0.42;
  transform: rotate(var(--zine-decor-rotate-left));
}

.desk-decor--stamp-left {
  width: 128px;
  height: 128px;
  left: max(20px, calc((100vw - var(--page-max-width)) / 2 - 142px));
  top: 62vh;
  background: var(--zine-decor-stamp-round) center / contain no-repeat;
  opacity: var(--zine-decor-opacity-bg);
  transform: rotate(-14deg);
}

.desk-decor--stamp-right {
  width: 146px;
  height: 146px;
  right: max(18px, calc((100vw - var(--page-max-width)) / 2 - 160px));
  top: 28vh;
  background: var(--zine-decor-stamp-premium) center / contain no-repeat;
  opacity: 0.3;
  transform: rotate(12deg);
}

.desk-decor--sketch-right {
  width: 132px;
  height: 132px;
  right: max(18px, calc((100vw - var(--page-max-width)) / 2 - 146px));
  top: 56vh;
  background: var(--zine-decor-food-sketch-5) center / contain no-repeat;
  opacity: 0.42;
  transform: rotate(-8deg);
}

.desk-decor--tape-bottom {
  width: 160px;
  height: 42px;
  right: max(20px, calc((100vw - var(--page-max-width)) / 2 - 154px));
  bottom: 18vh;
  background: var(--zine-decor-tape-blue) center / contain no-repeat;
  opacity: 0.54;
  transform: rotate(var(--zine-decor-rotate-right));
}

@media (max-width: 1280px) {
  .desk-decor--stamp-left,
  .desk-decor--stamp-right,
  .desk-decor--note-left {
    opacity: 0.18;
  }
}

@media (max-width: 768px) {
  .app-main {
    width: 100%;
    padding-top: 18px;
    padding-bottom: 40px;
  }

  .app-page {
    padding-inline: var(--zine-page-padding-mobile);
  }

  .app-page::before {
    inset: -14px 5px -24px;
  }

  .desk-decor {
    display: none;
  }
}
</style>
