<!-- @author Codex -->

<template>
  <article
    class="dish-card torn-edge"
    :class="{ 'is-clickable': clickable, 'is-tilt': tilt }"
    role="button"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <img
      class="dish-card__image"
      :class="imageShapeClass"
      :src="dish.image"
      :alt="`${dish.name}菜品图`"
    />
    <div class="dish-card__content">
      <div class="dish-card__title-row">
        <h3>{{ dish.name }}</h3>
        <span class="stamp">{{ stampLabel }}</span>
      </div>

      <p v-if="showCanteen" class="dish-card__canteen">{{ dish.canteenName }}</p>
      <p class="dish-card__desc">{{ dish.description }}</p>
      <p class="dish-card__comment handwrite">
        “{{ formatComment(dish.comment ?? '今天这份还挺稳。', 34).text }}”
        <span>（{{ formatComment(dish.comment ?? '今天这份还挺稳。', 34).length }}字）</span>
      </p>

      <div class="dish-card__meta">
        <span>评分 {{ dish.rating.toFixed(1) }}</span>
        <span>月售 {{ dish.monthlySales }}</span>
      </div>

      <p class="dish-card__price">¥{{ dish.price }} / {{ dish.valueNote ?? '吃到撑' }}</p>

      <div class="dish-card__tags">
        <span
          v-for="tag in safeTags"
          :key="`${dish.id}-${tag}`"
          class="dish-card__tag"
        >
          #{{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { formatComment } from '../../utils/commentText';
import { getRatingLabel } from '../../utils/ratingLabel';

defineOptions({
  name: 'DishCard',
});

const props = defineProps({
  dish: {
    type: Object,
    required: true,
  },
  showCanteen: {
    type: Boolean,
    default: false,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  tilt: {
    type: Boolean,
    default: false,
  },
  imageShape: {
    type: String,
    default: 'hard',
  },
});

const emit = defineEmits(['click']);

const safeTags = computed(() =>
  Array.isArray(props.dish.tags) && props.dish.tags.length > 0
    ? props.dish.tags
    : ['无标签']
);

const stampLabel = computed(() => getRatingLabel(props.dish.rating));

const imageShapeClass = computed(() => {
  if (props.imageShape === 'polygon') {
    return 'is-polygon';
  }
  if (props.imageShape === 'polaroid') {
    return 'is-polaroid';
  }
  return 'is-hard';
});

function handleClick() {
  if (props.clickable) {
    emit('click', props.dish);
  }
}
</script>

<style scoped lang="scss">
.dish-card {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 10px;
  display: grid;
  gap: 10px;
}

.dish-card.is-clickable {
  cursor: pointer;
}

.dish-card.is-clickable:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 rgb(58 36 24 / 30%);
}

.dish-card.is-tilt {
  transform: rotate(-1deg);
}

.dish-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.dish-card__image.is-hard {
  border: 1px solid var(--ft-color-secondary);
}

.dish-card__image.is-polygon {
  clip-path: polygon(3% 0, 100% 0, 98% 84%, 90% 100%, 2% 100%, 0 8%);
}

.dish-card__image.is-polaroid {
  border: 7px solid #fff;
  border-bottom-width: 24px;
  box-shadow: 3px 3px 0 rgb(58 36 24 / 30%);
}

.dish-card__content {
  display: grid;
  gap: 8px;
}

.dish-card__title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-family: var(--ft-font-family-title);
    font-size: 30px;
    font-weight: 900;
    line-height: 1.04;
  }
}

.dish-card__canteen {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.dish-card__desc {
  margin: 0;
  color: var(--ft-color-secondary-soft);
}

.dish-card__comment {
  margin: 0;
  color: var(--ft-color-primary);
  font-size: 22px;
}

.dish-card__comment span {
  color: var(--ft-color-text-muted);
  font-size: 13px;
}

.dish-card__meta {
  margin: 0;
  display: flex;
  justify-content: space-between;
  color: var(--ft-color-text-muted);
  font-size: var(--ft-font-size-sm);
}

.dish-card__price {
  margin: 0;
  color: var(--ft-color-secondary);
  font-weight: 800;
}

.dish-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dish-card__tag {
  border: 1px dashed rgb(58 36 24 / 34%);
  padding: 2px 7px;
  font-size: 12px;
}
</style>
