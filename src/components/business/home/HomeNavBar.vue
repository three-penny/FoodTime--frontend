<script setup>
defineOptions({ name: 'HomeNavBar' });

defineProps({
  menuItems: {
    type: Array,
    default: () => [],
  },
  messages: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: '',
  },
  activeRouteKey: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['navigate', 'profile-click', 'home-click']);
</script>

<template>
  <header class="home-nav-bar">
    <button
      class="home-nav-bar__brand"
      type="button"
      @click="emit('home-click')"
    >
      <strong>北交干饭吧</strong>
      <span class="home-nav-bar__subtitle">食堂打卡日记</span>
    </button>

    <nav class="home-nav-bar__menu">
      <button
        v-for="item in menuItems"
        :key="item.key"
        class="home-nav-bar__link"
        :class="{
          'is-active': activeKey === item.key || activeRouteKey === item.key,
        }"
        type="button"
        @click="emit('navigate', item)"
      >
        {{ item.label }}
      </button>

      <el-popover placement="bottom-end" width="300" trigger="click">
        <template #reference>
          <button class="home-nav-bar__link" type="button">消息</button>
        </template>

        <div class="home-nav-bar__notice-panel">
          <article
            v-for="message in messages"
            :key="message.title"
            class="home-nav-bar__notice-item"
          >
            <strong>{{ message.title }}</strong>
            <p>{{ message.content }}</p>
          </article>
        </div>
      </el-popover>
    </nav>

    <button
      class="home-nav-bar__avatar"
      type="button"
      @click="emit('profile-click')"
    >
      U
    </button>
  </header>
</template>

<style scoped>
.home-nav-bar {
  position: sticky;
  top: 12px;
  z-index: 30;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 16px 0 14px;
  border-bottom: 1px solid rgba(58, 36, 24, 0.24);
}

.home-nav-bar__brand,
.home-nav-bar__link,
.home-nav-bar__avatar {
  border: none;
  background: none;
  cursor: pointer;
}

.home-nav-bar__brand {
  display: grid;
  gap: 2px;
  padding: 0;
  text-align: left;
}

.home-nav-bar__brand strong {
  font-family: 'Noto Serif SC', 'Songti SC', serif;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.home-nav-bar__subtitle {
  color: var(--ft-text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.home-nav-bar__menu {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.home-nav-bar__link {
  position: relative;
  padding: 0 0 8px;
  color: var(--ft-text-secondary);
  font-size: 14px;
  font-weight: 700;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.home-nav-bar__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--ft-primary);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.2s ease;
}

.home-nav-bar__link:hover,
.home-nav-bar__link.is-active {
  color: var(--ft-brown);
  transform: translateY(-1px);
}

.home-nav-bar__link:hover::after,
.home-nav-bar__link.is-active::after {
  transform: scaleX(1);
}

.home-nav-bar__avatar {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 2px solid var(--ft-brown);
  color: var(--ft-brown);
  font-weight: 800;
  background: rgba(255, 255, 255, 0.6);
}

.home-nav-bar__notice-panel {
  display: grid;
  gap: 10px;
}

.home-nav-bar__notice-item {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-left: 3px solid var(--ft-primary);
  background: rgba(242, 239, 230, 0.72);
}

.home-nav-bar__notice-item strong {
  font-size: 14px;
}

.home-nav-bar__notice-item p {
  margin: 0;
  color: var(--ft-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 900px) {
  .home-nav-bar {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .home-nav-bar__menu {
    justify-content: flex-start;
  }
}
</style>
