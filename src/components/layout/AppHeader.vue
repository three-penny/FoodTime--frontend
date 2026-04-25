<template>
  <header class="app-header">
    <div class="app-header__inner">
      <button class="brand" type="button" @click="goHome">
        <span class="brand__logo">北交干饭吧</span>
        <span class="brand__desc">今天吃点什么</span>
      </button>

      <nav class="nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav__item"
          :class="{ 'is-active': activeKey === item.key }"
          type="button"
          @click="handleNavClick(item)"
        >
          {{ item.label }}
        </button>
      </nav>

      <button class="profile" type="button" @click="openProfile">
        <el-avatar :size="38" src="https://i.pravatar.cc/150?img=10" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'AppHeader',
});

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    key: 'canteen',
    label: '食堂',
    to: { name: 'homeCanteenSelect' },
  },
  {
    key: 'recommend',
    label: '推荐',
    to: { name: 'homeCanteenSelect', query: { section: 'recommend' } },
  },
  {
    key: 'review',
    label: '点评',
    to: { name: 'homeCanteenSelect', query: { section: 'review' } },
  },
  {
    key: 'message',
    label: '消息',
    to: { name: 'homeCanteenSelect', query: { section: 'message' } },
  },
];

const activeKey = computed(() => {
  if (route.name !== 'homeCanteenSelect') {
    return 'canteen';
  }

  return route.query.section ?? 'canteen';
});

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

function handleNavClick(item) {
  router.push(item.to);
}

function openProfile() {
  ElMessage({
    type: 'info',
    message: '个人中心功能建设中，敬请期待。',
  });
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  background: rgb(248 244 238 / 92%);
  border-bottom: 1px solid var(--ft-color-border);

  &__inner {
    width: min(1200px, calc(100% - 48px));
    margin: 0 auto;
    height: 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ft-space-2);
  }
}

.brand {
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  color: inherit;
  padding: 0;

  &__logo {
    display: block;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  &__desc {
    display: block;
    margin-top: 2px;
    font-size: var(--ft-font-size-xs);
    color: var(--ft-color-text-muted);
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: var(--ft-radius-pill);
  background: var(--ft-color-surface);
  box-shadow: var(--ft-shadow-sm);

  &__item {
    border: 0;
    border-radius: var(--ft-radius-pill);
    background: transparent;
    color: var(--ft-color-text-muted);
    padding: 8px 16px;
    font-size: var(--ft-font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--ft-transition-fast);

    &:hover {
      color: var(--ft-color-primary);
      background: rgb(221 107 32 / 8%);
      transform: translateY(-1px);
    }

    &.is-active {
      color: #fff;
      background: linear-gradient(
        135deg,
        var(--ft-color-primary),
        var(--ft-color-primary-soft)
      );
      box-shadow: 0 8px 18px rgb(221 107 32 / 28%);
    }
  }
}

.profile {
  border: 0;
  background: var(--ft-color-surface);
  border-radius: 50%;
  width: 46px;
  height: 46px;
  padding: 4px;
  cursor: pointer;
  box-shadow: var(--ft-shadow-sm);
  transition: transform var(--ft-transition-fast);

  &:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 900px) {
  .app-header {
    &__inner {
      width: calc(100% - 24px);
      height: auto;
      padding: 12px 0;
      flex-wrap: wrap;
    }
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
