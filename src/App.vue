<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <RouterView />
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 36px clamp(12px, 3.2vw, 36px) 56px;
}

@media (max-width: 768px) {
  .app-main {
    width: 100%;
    padding-top: 18px;
    padding-bottom: 40px;
    padding-inline: 10px;
  }
}
</style>
