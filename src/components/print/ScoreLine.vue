<script setup>
import { computed } from 'vue';

defineOptions({ name: 'ScoreLine' });

const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  align: {
    type: String,
    default: 'right',
  },
});

const scoreText = computed(() => `${props.score.toFixed(1)}/5.0`);
</script>

<template>
  <p class="score-line" :class="`is-${align}`">评分 {{ scoreText }}</p>
</template>
