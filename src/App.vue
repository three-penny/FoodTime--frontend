<script setup>
import { RouterView } from 'vue-router';

defineOptions({ name: 'App' });
</script>

<template>
  <div class="app-shell">
    <svg width="0" height="0" aria-hidden="true" focusable="false">
      <filter id="print-jitter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="1"
          seed="9"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="0.9"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}
</style>
