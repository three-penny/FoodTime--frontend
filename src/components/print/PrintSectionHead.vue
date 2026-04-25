<script setup>
defineOptions({ name: 'PrintSectionHead' });

defineProps({
  no: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  marker: {
    type: String,
    default: '◆',
  },
});
</script>

<template>
  <header
    class="grid gap-2 border-b border-ink pb-2 md:grid-cols-[auto_1fr_auto] md:items-end"
  >
    <div class="print-decoration text-ink">
      <span>[No.{{ no }}]</span>
    </div>
    <div>
      <p
        v-if="subtitle"
        class="m-0 text-[12px] font-sans font-black tracking-[0.08em] text-maroon"
      >
        {{ subtitle }}
      </p>
      <h2
        class="m-0 font-serif text-[clamp(30px,4vw,44px)] font-black tracking-tightprint"
      >
        {{ title }}
      </h2>
    </div>
    <span
      class="print-symbol justify-self-start text-maroon md:justify-self-end"
      >{{ marker }}</span
    >
  </header>
</template>
