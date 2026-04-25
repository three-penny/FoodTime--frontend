<script setup>
defineOptions({ name: 'HomeFooter' });
</script>

<template>
  <footer class="home-footer">
    <div class="home-footer__copy">
      <strong>北交干饭吧</strong>
      <span>今天吃什么，记下来就行。</span>
    </div>

    <svg
      class="home-footer__chopsticks"
      viewBox="0 0 120 30"
      aria-hidden="true"
    >
      <path
        d="M8 7h104M14 22h96"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="3"
      />
    </svg>
  </footer>
</template>

<style scoped>
.home-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 0 0;
  border-top: 1px solid rgba(58, 36, 24, 0.24);
  color: var(--ft-text-muted);
}

.home-footer__copy {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 13px;
}

.home-footer__copy strong {
  color: var(--ft-text);
}

.home-footer__chopsticks {
  width: 112px;
  height: 28px;
  color: rgba(58, 36, 24, 0.44);
}

@media (max-width: 760px) {
  .home-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
