<script setup>
defineOptions({ name: 'LeaderDotsRow' });

defineProps({
  left: {
    type: String,
    required: true,
  },
  right: {
    type: String,
    required: true,
  },
  leftClass: {
    type: String,
    default: '',
  },
  rightClass: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="print-leader-row">
    <span :class="leftClass">{{ left }}</span>
    <span class="print-leader-row__dots" aria-hidden="true" />
    <span :class="rightClass">{{ right }}</span>
  </div>
</template>
