<template>
  <footer class="app-footer torn-edge">
    <div class="app-footer__inner">
      <div class="app-footer__left">
        <p class="app-footer__title">食堂日记 / BJTU Canteen Zine</p>
        <p class="app-footer__desc handwrite">“今天排队 20 分钟，值不值看这口。”</p>
      </div>
      <p class="app-footer__meta">2026 · 北交干饭吧 · 学生自制版本</p>
    </div>

    <svg class="app-footer__decor" viewBox="0 0 90 38" aria-hidden="true">
      <path class="decor-svg" d="M6 8h32M14 16h32M22 24h32M30 32h32" />
      <path class="decor-svg" d="M58 6l26 26M70 6l14 14" />
    </svg>
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
  width: 100%;
  margin: 0;
  min-height: 86px;
  padding: 16px clamp(12px, 3.2vw, 36px);
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

.app-footer__decor {
  position: absolute;
  right: 24px;
  bottom: 2px;
  width: 92px;
  opacity: 0.3;
}

@media (max-width: 768px) {
  .app-footer__inner {
    padding-inline: 10px;
  }
}
</style>
