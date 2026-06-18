<!-- @author XXXXX -->

<template>
  <header class="app-header torn-edge">
    <div class="app-header__inner">
      <button class="brand" type="button" @click="goHome">
        <span class="brand__title">北交干饭吧</span>
        <span class="brand__sub handwrite">今天食堂不开盲盒</span>
      </button>

      <nav v-if="!isAuthPage" class="nav">
        <div v-for="item in visibleNavItems" :key="item.key" class="nav__group">
          <button
            class="nav__item"
            :class="{ 'is-active': activeKey === item.key }"
            type="button"
            @click="handleNavClick(item)"
          >
            <span class="nav__index">{{ item.index }}</span>
            <span>{{ item.label }}</span>
          </button>

          <div v-if="item.key === 'message'" class="message-popover">
            <article
              v-for="message in previewMessages"
              :key="message.id"
              class="message-popover__item"
            >
              <span class="message-popover__tag">{{ message.tag }}</span>
              <strong>{{ message.title }}</strong>
              <p>{{ message.content }}</p>
            </article>
          </div>
        </div>
      </nav>

      <div v-if="!isAuthPage" class="account-actions">
        <button class="profile" type="button" @click="goProfile">
          <span class="profile__avatar">饭</span>
          <span class="profile__label handwrite">{{ authStore.displayName }}</span>
        </button>
        <button class="logout" type="button" @click="handleLogout">退出</button>
      </div>
    </div>

    <span
      class="app-header__bg-decor app-header__bg-decor--stamp"
      aria-hidden="true"
    ></span>
    <span
      class="app-header__bg-decor app-header__bg-decor--food"
      aria-hidden="true"
    ></span>
    <span
      class="app-header__bg-decor app-header__bg-decor--tape"
      aria-hidden="true"
    ></span>
  </header>

  <nav v-if="!isAuthPage" class="mobile-tabbar" aria-label="手机端主导航">
    <button
      v-for="item in mobileTabItems"
      :key="item.key"
      class="mobile-tabbar__item"
      :class="{ 'is-active': activeKey === item.key }"
      type="button"
      @click="handleNavClick(item)"
    >
      <span class="mobile-tabbar__mark" aria-hidden="true">{{ item.index }}</span>
      <span class="mobile-tabbar__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchMessages } from '../../api/message.api';
import { useAuthStore } from '../../store/useAuthStore';

defineOptions({
  name: 'AppHeader',
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  {
    key: 'canteen',
    index: '01',
    label: '食堂',
    to: { name: 'homeCanteenSelect', query: { section: 'canteens' } },
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
    to: { name: 'reviewCreate' },
  },
  {
    key: 'message',
    index: '04',
    label: '消息',
    to: { name: 'messageCenter' },
  },
  {
    key: 'upload',
    index: '05',
    label: '投稿',
    to: { name: 'dishUpload' },
  },
  {
    key: 'admin',
    index: '06',
    label: '审核台',
    to: { name: 'adminAudit' },
    adminOnly: true,
  },
  {
    key: 'manage',
    index: '07',
    label: '管理台',
    to: { name: 'adminManage' },
    adminOnly: true,
  },
  {
    key: 'superadmin',
    index: '99',
    label: '控制台',
    to: { name: 'superadmin' },
    superadminOnly: true,
  },
];

const previewMessages = ref([]);

onMounted(async () => {
  try {
    const res = await fetchMessages();
    previewMessages.value = (res.data || []).slice(0, 4);
  } catch (e) {
    console.error('加载消息预览失败:', e);
  }
});

const visibleNavItems = computed(() =>
  navItems.filter(item => {
    if (item.superadminOnly) return authStore.currentRole === 'superadmin';
    if (item.adminOnly) return authStore.currentRole === 'admin' || authStore.currentRole === 'superadmin';
    return true;
  })
);

const mobileTabItems = computed(() => {
  const baseKeys = ['canteen', 'recommend', 'review', 'message', 'upload'];
  const items = baseKeys
    .map(key => navItems.find(item => item.key === key))
    .filter(Boolean);

  if (authStore.currentRole === 'superadmin') {
    items.push(navItems.find(item => item.key === 'superadmin'));
  } else if (authStore.currentRole === 'admin') {
    items.push(navItems.find(item => item.key === 'admin'));
  }

  items.push({
    key: 'profile',
    index: 'ME',
    label: '我的',
    to: { name: 'profile' },
  });

  return items.filter(Boolean);
});
const isAuthPage = computed(
  () => route.name === 'login' || route.name === 'register'
);

const activeKey = computed(() => {
  if (route.name === 'reviewCreate') {
    return 'review';
  }
  if (route.name === 'messageCenter' || route.name === 'rantWall') {
    return 'message';
  }
  if (route.name === 'dishUpload' || route.name === 'userSubmissions') {
    return 'upload';
  }
  if (route.name === 'adminAudit') {
    return 'admin';
  }
  if (route.name === 'superadmin') {
    return 'superadmin';
  }
  if (route.name === 'adminManage') {
    return 'manage';
  }
  if (route.name === 'profile') {
    return 'profile';
  }
  if (route.name === 'login' || route.name === 'register') {
    return 'login';
  }
  if (route.name !== 'homeCanteenSelect') {
    return 'canteen';
  }

  if (route.query.section === 'canteens') {
    return 'canteen';
  }
  if (route.query.section === 'recommend') {
    return 'recommend';
  }
  return '';
});

function goHome() {
  router.push({ name: 'homeCanteenSelect' });
}

async function handleNavClick(item) {
  const targetSection = item.to?.query?.section;
  const isSameHomeSection =
    item.to?.name === 'homeCanteenSelect' &&
    route.name === 'homeCanteenSelect' &&
    route.query.section === targetSection;

  try {
    await router.push(item.to);
  } catch (e) {
    console.warn('[Nav] 跳转拦截或失败:', e?.message);
  }

  if (isSameHomeSection && typeof targetSection === 'string') {
    window.dispatchEvent(
      new CustomEvent('foodtime:home-section-request', {
        detail: {
          section: targetSection,
        },
      }),
    );
  }
}

function goProfile() {
  router.push({ name: 'profile' });
}

function handleLogout() {
  authStore.logout();
  router.push({ name: 'login' });
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
  position: relative;
  z-index: 2;
  width: min(100%, calc(var(--page-max-width) + var(--zine-page-padding) * 2));
  margin: 0 auto;
  min-height: 82px;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: var(--ft-space-2);
  align-items: center;
  padding: 6px var(--zine-page-padding);
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

.nav__group {
  position: relative;
}

.nav__item {
  border: 1px solid transparent;
  background: transparent;
  min-width: 76px;
  min-height: 48px;
  padding: 9px 12px;
  cursor: pointer;
  color: var(--ft-color-secondary);
  font: inherit;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    transform var(--ft-transition-fast),
    border-color var(--ft-transition-fast);

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

.message-popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(360px, 80vw);
  display: none;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  box-shadow: 6px 6px 0 rgb(58 36 24 / 18%);
  z-index: 60;
  transform: rotate(-0.4deg);
}

.nav__group:hover .message-popover,
.nav__group:focus-within .message-popover {
  display: grid;
}

.message-popover::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -14px;
  width: 92px;
  height: 26px;
  background: var(--zine-decor-tape-red) center / contain no-repeat;
  opacity: 0.76;
  mix-blend-mode: multiply;
}

.message-popover__item {
  display: grid;
  gap: 3px;
  border-bottom: 1px dashed rgb(58 36 24 / 22%);
  padding-bottom: 8px;
}

.message-popover__item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.message-popover__tag {
  width: fit-content;
  border: 1px solid var(--zine-stamp-red);
  color: var(--zine-stamp-red);
  padding: 1px 6px;
  font-size: 12px;
}

.message-popover__item strong {
  font-family: var(--ft-font-family-title);
  font-size: 17px;
}

.message-popover__item p {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: 13px;
  line-height: 1.45;
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

.account-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.logout {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  color: var(--ft-color-secondary);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 8px 12px;
  box-shadow: 2px 2px 0 var(--ft-color-secondary);
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

.app-header__bg-decor {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
}

.app-header__bg-decor--stamp {
  width: 98px;
  height: 98px;
  left: max(430px, calc((100vw - var(--page-max-width)) / 2 + 374px));
  top: -14px;
  background: var(--zine-decor-stamp-recommend) center / contain no-repeat;
  opacity: 0.26;
  transform: rotate(-9deg);
}

.app-header__bg-decor--food {
  width: 78px;
  height: 78px;
  right: max(18px, calc((100vw - var(--page-max-width)) / 2 + 8px));
  bottom: -22px;
  background: var(--zine-decor-food-sketch-4) center / contain no-repeat;
  opacity: 0.24;
  transform: rotate(7deg);
}

.app-header__bg-decor--tape {
  width: 130px;
  height: 34px;
  left: max(310px, calc((100vw - var(--page-max-width)) / 2 + 278px));
  bottom: 7px;
  background: var(--zine-decor-tape-blue) center / contain no-repeat;
  opacity: 0.36;
  transform: rotate(3deg);
}

.mobile-tabbar {
  display: none;
}

@media (max-width: 1180px) {
  .app-header__bg-decor {
    display: none;
  }
}

@media (max-width: 980px) {
  .app-header__inner {
    grid-template-columns: minmax(0, 1fr) auto;
    min-height: 64px;
    padding: 8px var(--zine-page-padding-mobile);
    gap: 12px;
  }

  .nav {
    display: none;
  }

  .message-popover {
    display: none;
  }

  .account-actions {
    justify-self: end;
    gap: 8px;
  }

  .profile__label {
    max-width: min(30vw, 140px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout {
    min-height: 38px;
    padding: 6px 10px;
    box-shadow: 1px 1px 0 var(--ft-color-secondary);
    font-size: 14px;
  }

  .mobile-tabbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 70;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    min-height: calc(
      var(--app-mobile-tabbar-height) + var(--app-mobile-safe-bottom)
    );
    padding: 7px 8px calc(7px + var(--app-mobile-safe-bottom));
    border-top: 1px solid rgb(58 36 24 / 26%);
    background:
      linear-gradient(180deg, rgb(255 250 240 / 96%), rgb(242 239 230 / 98%)),
      var(--zine-paper-card);
    box-shadow: 0 -8px 22px rgb(58 36 24 / 13%);
    backdrop-filter: blur(8px);
  }

  .mobile-tabbar__item {
    appearance: none;
    min-width: 0;
    min-height: 54px;
    border: 0;
    background: transparent;
    color: var(--ft-color-text-muted);
    cursor: pointer;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 2px;
    padding: 4px 2px;
    font: inherit;
    line-height: 1.1;
  }

  .mobile-tabbar__item.is-active {
    color: var(--ft-color-primary);
  }

  .mobile-tabbar__mark {
    display: inline-grid;
    place-items: center;
    min-width: 26px;
    height: 22px;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-family: var(--zine-title-font);
    font-size: 10px;
    font-weight: 900;
    line-height: 1;
  }

  .mobile-tabbar__item.is-active .mobile-tabbar__mark {
    background: var(--zine-stamp-red-soft);
    box-shadow: 2px 2px 0 rgb(58 36 24 / 14%);
  }

  .mobile-tabbar__label {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 800;
  }
}

@media (max-width: 520px) {
  .brand__title {
    font-size: 24px;
  }

  .brand__sub {
    font-size: 13px;
  }

  .account-actions {
    gap: 8px;
  }

  .profile {
    gap: 6px;
  }

  .profile__avatar {
    width: 30px;
    height: 30px;
    box-shadow: 1px 1px 0 var(--ft-color-secondary);
  }

  .profile__label {
    display: none;
  }

  .logout {
    min-height: 34px;
    padding: 5px 8px;
    font-size: 13px;
  }

  .mobile-tabbar {
    padding-inline: 5px;
  }

  .mobile-tabbar__mark {
    min-width: 24px;
    height: 20px;
  }

  .mobile-tabbar__label {
    font-size: 11px;
  }
}
</style>
