<template>
  <section class="canteen-intro" data-test="canteen-intro">
    <div class="canteen-intro__grid">
      <article
        v-for="canteen in canteens"
        :key="canteen.id"
        class="canteen-intro__item"
      >
        <h3>{{ canteen.name }}</h3>
        <p>{{ canteen.summary }}</p>
        <ul>
          <li v-for="feature in canteen.features" :key="`${canteen.id}-${feature}`">
            {{ feature }}
          </li>
        </ul>
        <div class="canteen-intro__action">
          <el-button
            type="primary"
            plain
            @click="jumpToDishList(canteen.id)"
          >
            查看该食堂菜品
          </el-button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineOptions({
  name: 'CanteenIntroGrid',
});

const props = defineProps({
  canteens: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();

function jumpToDishList(canteenId) {
  router.push({
    name: 'dishList',
    params: { canteenId },
  });
}
</script>

<style scoped lang="scss">
.canteen-intro {
  margin-top: var(--ft-space-3);
}

.canteen-intro__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ft-space-2);
}

.canteen-intro__item {
  border: 1px solid var(--ft-color-border);
  border-radius: var(--ft-radius-md);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);
  padding: var(--ft-space-3);

  h3 {
    margin: 0 0 10px;
    font-size: var(--ft-font-size-lg);
  }

  p {
    margin: 0;
    color: var(--ft-color-text-muted);
    line-height: 1.7;
  }

  ul {
    margin: 14px 0 0;
    padding-left: 16px;
    color: var(--ft-color-text);
    line-height: 1.7;
  }
}

.canteen-intro__action {
  margin-top: var(--ft-space-2);
}

@media (max-width: 900px) {
  .canteen-intro__grid {
    grid-template-columns: 1fr;
  }
}
</style>
