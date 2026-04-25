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
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 24px 0 40px;
}
</style>
