<script setup>
import { ref } from 'vue';

defineOptions({ name: 'VoteButtons' });

const props = defineProps({
  recommendBase: {
    type: Number,
    default: 0,
  },
  badBase: {
    type: Number,
    default: 0,
  },
});

const selected = ref('');
const recommendCount = ref(props.recommendBase);
const badCount = ref(props.badBase);

function vote(type) {
  if (selected.value === type) {
    return;
  }

  if (selected.value === 'recommend') {
    recommendCount.value = Math.max(0, recommendCount.value - 1);
  }

  if (selected.value === 'bad') {
    badCount.value = Math.max(0, badCount.value - 1);
  }

  if (type === 'recommend') {
    recommendCount.value += 1;
  }

  if (type === 'bad') {
    badCount.value += 1;
  }

  selected.value = type;
}
</script>

<template>
  <div class="vote-actions">
    <button
      type="button"
      class="vote-actions__btn"
      :class="{ 'is-active': selected === 'recommend' }"
      @click="vote('recommend')"
    >
      推荐 {{ recommendCount }}
    </button>
    <button
      type="button"
      class="vote-actions__btn"
      :class="{ 'is-active': selected === 'bad' }"
      @click="vote('bad')"
    >
      踩雷 {{ badCount }}
    </button>
  </div>
</template>

<style scoped>
.vote-actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vote-actions__btn {
  border: 1px solid var(--ft-ink);
  border-radius: 2px;
  padding: 2px 8px;
  color: var(--ft-ink);
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 700;
  background: var(--ft-ivory);
  transition:
    color var(--ft-transition),
    border-color var(--ft-transition),
    background-color var(--ft-transition);
}

.vote-actions__btn:hover,
.vote-actions__btn.is-active {
  color: var(--ft-ivory);
  border-color: var(--ft-red);
  background: var(--ft-red);
}
</style>
