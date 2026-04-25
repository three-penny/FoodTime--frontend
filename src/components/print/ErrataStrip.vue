<script setup>
defineOptions({ name: 'ErrataStrip' });

defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <p class="print-errata">{{ text }}</p>
</template>
