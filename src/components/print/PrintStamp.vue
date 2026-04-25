<script setup>
defineOptions({ name: 'PrintStamp' });

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'red',
  },
  rotate: {
    type: Number,
    default: 0,
  },
});

const toneClassMap = {
  red: '',
  deep: 'text-maroon border-maroon',
  green: 'print-status-open',
  close: 'print-status-close',
};
</script>

<template>
  <span
    class="print-stamp"
    :class="toneClassMap[props.tone] || ''"
    :style="{ transform: `rotate(${props.rotate}deg)` }"
  >
    {{ props.text }}
  </span>
</template>
