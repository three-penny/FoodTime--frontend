<template>
  <header class="app-header torn-edge">
    <div class="app-header__inner">
      <button class="brand" type="button" @click="goHome">
        <span class="brand__title">北交干饭吧</span>
        <span class="brand__sub handwrite">今天食堂开盲盒</span>
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
          <span class="nav__index">{{ item.index }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <button class="profile" type="button" @click="goProfile">
        <span class="profile__avatar">饭</span>
        <span class="profile__label handwrite">个人中心</span>
      </button>
    </div>

    <svg class="decor decor--soy" viewBox="0 0 64 64" aria-hidden="true">
      <path class="decor-svg" d="M26 8h12l4 8v10l-6 5v21H28V31l-6-5V16z" />
      <path class="decor-svg" d="M26 18h16M28 38h8" />
    </svg>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'AppHeader',
});

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    key: 'canteen',
    index: '01',
    label: '食堂',
    to: { name: 'homeCanteenSelect' },
  },
  {
    key: 'recommend',
    index: '02',
    label: '推荐',
    to: { name: 'homeCanteenSelect', query: { section: 'recommend' } },
  },
  {
    key: 'review',
    index: '03',
    label: '点评',
    to: { name: 'homeCanteenSelect', query: { section: 'review' } },
  },
  {
    key: 'message',
    index: '04',
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

function goProfile() {
  router.push({ name: 'homeCanteenSelect', query: { section: 'message' } });
}
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--ft-color-secondary);
  background: rgb(242 239 230 / 94%);
  backdrop-filter: blur(4px);
}

.app-header__inner {
  width: 100%;
  margin: 0;
  min-height: 82px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--ft-space-2);
  align-items: center;
  padding: 6px clamp(12px, 3.2vw, 36px);
}

.brand {
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  color: inherit;
  padding: 0;
}

.brand__title {
  display: block;
  font-family: var(--ft-font-family-title);
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0.03em;
  line-height: 0.95;
}

.brand__sub {
  display: block;
  margin-top: 2px;
  color: var(--ft-color-text-muted);
  font-size: 18px;
}

.nav {
  display: flex;
  gap: 8px;
  border-left: 1px solid rgb(58 36 24 / 22%);
  padding-left: 16px;
}

.nav__item {
  border: 1px solid transparent;
  background: transparent;
  padding: 8px 10px;
  cursor: pointer;
  color: var(--ft-color-secondary);
  font: inherit;
  font-weight: 700;
  display: grid;
  justify-items: start;
  transition: transform var(--ft-transition-fast), border-color var(--ft-transition-fast);

  &:hover {
    transform: translateY(-1px);
    border-color: rgb(58 36 24 / 35%);
  }

  &.is-active {
    color: var(--ft-color-primary);
    border-color: var(--ft-color-primary);
    box-shadow: 3px 3px 0 rgb(58 36 24 / 60%);
    transform: rotate(-1deg);
  }
}

.nav__index {
  font-size: 11px;
  color: rgb(58 36 24 / 60%);
  letter-spacing: 0.09em;
}

.profile {
  border: 0;
  background: none;
  cursor: pointer;
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.profile__avatar {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  font-family: var(--ft-font-family-title);
  font-weight: 900;
  box-shadow: 2px 2px 0 var(--ft-color-secondary);
}

.profile__label {
  font-size: 19px;
}

.decor {
  position: absolute;
  pointer-events: none;
  opacity: 0.35;
}

.decor--soy {
  width: 44px;
  height: 44px;
  right: 14px;
  top: 10px;
  transform: rotate(8deg);
}

@media (max-width: 980px) {
  .app-header__inner {
    grid-template-columns: 1fr;
    padding: 10px 10px 14px;
    gap: 10px;
  }

  .nav {
    border-left: 0;
    padding-left: 0;
    flex-wrap: wrap;
  }

  .profile {
    justify-self: end;
  }
}
</style>
