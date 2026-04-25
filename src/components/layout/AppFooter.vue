<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p>北交干饭吧 · 让每一餐都更有把握</p>
      <p>© 2026 FoodTime Frontend</p>
    </div>
  </footer>
</template>

<script setup>
defineOptions({
  name: 'AppFooter',
});
</script>

<style scoped lang="scss">
.app-footer {
  border-top: 1px solid var(--ft-color-border);
  background: rgb(255 253 249 / 88%);

  &__inner {
    width: min(1200px, calc(100% - 48px));
    margin: 0 auto;
    min-height: 72px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    color: var(--ft-color-text-muted);
    font-size: var(--ft-font-size-sm);
  }
}
</style>
