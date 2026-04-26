<!-- @author Codex -->

<template>
  <footer class="app-footer torn-edge">
    <div class="app-footer__inner">
      <div class="app-footer__left">
        <p class="app-footer__title">食堂日记 / BJTU Canteen Zine</p>
        <p class="app-footer__desc handwrite">“今天排队 20 分钟，值不值看这口。”</p>
      </div>
      <p class="app-footer__meta">2026 · 北交干饭吧 · 学生自制版本</p>
    </div>

    <span class="app-footer__bg-decor app-footer__bg-decor--stamp" aria-hidden="true"></span>
    <span class="app-footer__bg-decor app-footer__bg-decor--doodle" aria-hidden="true"></span>
    <span class="app-footer__bg-decor app-footer__bg-decor--torn" aria-hidden="true"></span>
  </footer>
</template>

<script setup>
defineOptions({
  name: 'AppFooter',
});
</script>

<style scoped lang="scss">
.app-footer {
  position: relative;
  border-top: 1px solid var(--ft-color-secondary);
  background: rgb(242 239 230 / 94%);
  overflow: hidden;
}

.app-footer__inner {
  position: relative;
  z-index: 2;
  width: min(100%, calc(var(--page-max-width) + var(--zine-page-padding) * 2));
  margin: 0 auto;
  min-height: 86px;
  padding: 16px var(--zine-page-padding);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.app-footer__title {
  margin: 0;
  font-family: var(--ft-font-family-title);
  font-weight: 900;
  letter-spacing: 0.03em;
}

.app-footer__desc {
  margin: 2px 0 0;
  color: var(--ft-color-text-muted);
  font-size: 18px;
}

.app-footer__meta {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.app-footer__bg-decor {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
}

.app-footer__bg-decor--stamp {
  width: 138px;
  height: 138px;
  left: max(460px, calc((100vw - var(--page-max-width)) / 2 + 452px));
  top: -34px;
  background: var(--zine-decor-stamp-chinese) center / contain no-repeat;
  opacity: 0.2;
  transform: rotate(-7deg);
}

.app-footer__bg-decor--doodle {
  width: 116px;
  height: 74px;
  right: max(18px, calc((100vw - var(--page-max-width)) / 2 - 6px));
  bottom: 8px;
  background: var(--zine-decor-arrow) center / contain no-repeat;
  opacity: 0.26;
  transform: rotate(6deg);
}

.app-footer__bg-decor--torn {
  width: 300px;
  height: 86px;
  left: max(18px, calc((100vw - var(--page-max-width)) / 2 - 28px));
  bottom: -34px;
  background: var(--zine-decor-torn-edge) center / contain no-repeat;
  opacity: 0.24;
  transform: rotate(1deg);
}

@media (max-width: 1100px) {
  .app-footer__bg-decor--stamp {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-footer__inner {
    padding-inline: var(--zine-page-padding-mobile);
  }

  .app-footer__bg-decor--doodle,
  .app-footer__bg-decor--torn {
    display: none;
  }
}
</style>
