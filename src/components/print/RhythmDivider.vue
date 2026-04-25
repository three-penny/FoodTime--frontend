<script setup>
defineOptions({ name: 'RhythmDivider' });

defineProps({
  type: {
    type: String,
    default: 'A',
  },
});
</script>

<template>
  <div class="rhythm-divider" :class="`is-${type}`">
    <template v-if="type === 'A'">
      <span class="rhythm-divider__line rhythm-divider__line--red-thick" />
      <span class="rhythm-divider__line rhythm-divider__line--ink-thin" />
    </template>

    <template v-else-if="type === 'B'">
      <span class="rhythm-divider__line rhythm-divider__line--red-dashed" />
    </template>

    <template v-else-if="type === 'C'">
      <span class="rhythm-divider__line rhythm-divider__line--ink-mid" />
      <span class="rhythm-divider__symbol">◆</span>
    </template>

    <template v-else>
      <span class="rhythm-divider__line rhythm-divider__line--ink-cut" />
      <span class="rhythm-divider__symbol">✂</span>
    </template>
  </div>
</template>
