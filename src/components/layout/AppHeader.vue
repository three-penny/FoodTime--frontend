<!-- @author Codex -->

<template>
  <header class="app-header torn-edge">
    <div class="app-header__inner">
      <button class="brand" type="button" @click="goHome">
        <span class="brand__title">北交干饭吧</span>
        <span class="brand__sub handwrite">今天食堂不开盲盒</span>
      </button>

      <nav class="nav">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav__group"
        >
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

      <button class="profile" type="button" @click="goProfile">
        <span class="profile__avatar">饭</span>
        <span class="profile__label handwrite">个人中心</span>
      </button>
    </div>

    <span class="app-header__bg-decor app-header__bg-decor--stamp" aria-hidden="true"></span>
    <span class="app-header__bg-decor app-header__bg-decor--food" aria-hidden="true"></span>
    <span class="app-header__bg-decor app-header__bg-decor--tape" aria-hidden="true"></span>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CANTEEN_MESSAGES } from '../../constants/messages';

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
];

const previewMessages = CANTEEN_MESSAGES.slice(0, 4);

const activeKey = computed(() => {
  if (route.name === 'reviewCreate') {
    return 'review';
  }
  if (route.name === 'messageCenter') {
    return 'message';
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
  overflow: hidden;
}

.app-header__inner {
  position: relative;
  z-index: 2;
  width: min(100%, calc(var(--page-max-width) + var(--zine-page-padding) * 2));
  margin: 0 auto;
  min-height: 82px;
  display: grid;
  grid-template-columns: 1fr auto auto;
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
  min-width: 94px;
  min-height: 48px;
  padding: 9px 16px;
  cursor: pointer;
  color: var(--ft-color-secondary);
  font: inherit;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

@media (max-width: 1180px) {
  .app-header__bg-decor {
    display: none;
  }
}

@media (max-width: 980px) {
  .app-header__inner {
    grid-template-columns: 1fr;
    padding: 10px var(--zine-page-padding-mobile) 14px;
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
