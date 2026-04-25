<script setup>
defineOptions({ name: 'CanteenCard' });

defineProps({
  canteen: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['view-detail', 'view-menu']);
</script>

<template>
  <article class="canteen-card">
    <img :src="canteen.image" :alt="canteen.name" class="canteen-card__image" />

    <div class="canteen-card__content">
      <div class="canteen-card__top">
        <div>
          <h3>{{ canteen.name }}</h3>
          <p>{{ canteen.location }}</p>
        </div>
        <span class="ft-chip">{{ canteen.badges[0] }}</span>
      </div>

      <p class="canteen-card__brief">{{ canteen.brief }}</p>

      <div class="canteen-card__meta">
        <span>{{ canteen.bestFor }}</span>
        <span class="ft-number">{{ canteen.businessHours }}</span>
        <span class="ft-number">¥{{ canteen.averagePrice }}</span>
      </div>

      <div class="canteen-card__actions">
        <el-button type="primary" @click="emit('view-detail', canteen.id)"
          >去食堂</el-button
        >
        <el-button @click="emit('view-menu', canteen.id)">看菜单</el-button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.canteen-card {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--ft-border);
  border-radius: var(--ft-radius-card);
  background: var(--ft-surface);
  box-shadow: var(--ft-shadow-soft);
}

.canteen-card__image {
  width: 100%;
  height: 100%;
  min-height: 152px;
  border-radius: 14px;
  object-fit: cover;
}

.canteen-card__content {
  display: grid;
  gap: 12px;
}

.canteen-card__top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.canteen-card__top h3 {
  margin: 0 0 6px;
  font-size: 22px;
}

.canteen-card__top p,
.canteen-card__brief {
  margin: 0;
  color: var(--ft-text-secondary);
  line-height: 1.7;
}

.canteen-card__meta,
.canteen-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.canteen-card__meta {
  color: var(--ft-text-muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .canteen-card {
    grid-template-columns: 1fr;
  }

  .canteen-card__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
