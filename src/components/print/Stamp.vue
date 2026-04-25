<script setup>
import { computed } from 'vue';

defineOptions({ name: 'Stamp' });

const props = defineProps({
  level: {
    type: String,
    default: '推荐',
  },
  votes: {
    type: Number,
    default: 0,
  },
  seed: {
    type: [String, Number],
    default: '',
  },
});

const levelMap = {
  必吃: 'must',
  推荐: 'good',
  再议: 'hold',
  踩雷: 'bad',
};

function calcRotation(seedValue) {
  const raw = `${seedValue || ''}`;
  const hash = raw
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return (hash % 15) - 6;
}

const normalizedLevel = computed(() => {
  if (levelMap[props.level]) {
    return props.level;
  }

  return '推荐';
});

const toneClass = computed(() => `is-${levelMap[normalizedLevel.value]}`);
const isCircle = computed(
  () => normalizedLevel.value === '必吃' || normalizedLevel.value === '推荐',
);
const isBad = computed(() => normalizedLevel.value === '踩雷');
const rotateStyle = computed(() => ({
  '--stamp-rot': `${calcRotation(`${props.seed}${normalizedLevel.value}`)}deg`,
}));
</script>

<template>
  <div class="rating-stamp" :class="toneClass">
    <span
      class="rating-stamp__badge"
      :class="{ 'is-circle': isCircle }"
      :style="rotateStyle"
    >
      <span class="rating-stamp__layer rating-stamp__layer--offset">
        {{ normalizedLevel }}
      </span>
      <span class="rating-stamp__layer rating-stamp__layer--front">
        {{ normalizedLevel }}
      </span>
      <span v-if="isBad" class="rating-stamp__slash" />
    </span>
    <p class="rating-stamp__meta">基于 {{ votes }} 位同学评分</p>
  </div>
</template>
