<!-- @author XXXXX -->

<template>
  <section class="auth-view">
    <div class="section-rule">
      <span class="section-rule__index">00</span>
      <span class="section-rule__line"></span>
    </div>

    <article class="auth-panel torn-edge">
      <div class="auth-panel__intro">
        <span class="sticker sticker--r-1">平台入口</span>
        <h1>登录 FoodTime</h1>
        <p class="handwrite">
          先登录，再进入食堂浏览、菜品投稿和个人投稿进度页面。
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="auth-tabs" aria-label="登录身份">
          <button
            class="auth-tabs__item"
            :class="{ 'is-active': form.role === 'user' }"
            type="button"
            @click="form.role = 'user'"
          >
            用户登录
          </button>
          <button
            class="auth-tabs__item"
            :class="{ 'is-active': form.role === 'admin' }"
            type="button"
            @click="form.role = 'admin'"
          >
            管理员登录
          </button>
        </div>

        <label>
          <span>{{ form.role === 'admin' ? '管理员账号' : '学号 / 手机号' }}</span>
          <input v-model.trim="form.account" type="text" autocomplete="username" />
        </label>
        <label>
          <span>密码</span>
          <input
            v-model.trim="form.password"
            type="password"
            autocomplete="current-password"
          />
        </label>
        <p v-if="message" class="auth-form__message">{{ message }}</p>
        <div class="auth-form__actions">
          <button class="button-ink is-primary" type="submit">登录</button>
          <button class="button-ink" type="button" @click="goRegister">
            注册账号
          </button>
        </div>
      </form>
    </article>
  </section>
</template>

<script setup>
/**
 * LoginView
 * 职责：作为平台最前置入口，区分用户和管理员登录身份。
 * 作者：XXXXX
 * 使用场景：所有业务页面访问前的登录校验入口。
 * 依赖：Pinia、Vue Router、useAuthStore。
 */
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/useAuthStore';

defineOptions({
  name: 'LoginView',
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const message = ref('');
const form = reactive({
  role: 'user',
  account: '',
  password: '',
});

function handleLogin() {
  if (!form.account || !form.password) {
    message.value = '请填写账号和密码。';
    return;
  }

  authStore.login({
    account: form.account,
    role: form.role,
  });
  router.push(
    String(route.query.redirect || (form.role === 'admin' ? '/admin/audit' : '/')),
  );
}

function goRegister() {
  router.push({ name: 'register' });
}
</script>

<style scoped lang="scss">
.auth-view {
  min-width: 0;
}

.auth-panel {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 0.7fr);
  gap: var(--ft-space-4);
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: clamp(22px, 4vw, 42px);
}

.auth-panel__intro h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}

.auth-panel__intro p {
  margin: 18px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}

.auth-form {
  display: grid;
  gap: 16px;
  align-self: center;
}

.auth-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.auth-tabs__item {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  color: var(--ft-color-secondary);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 10px;
}

.auth-tabs__item.is-active {
  border-color: var(--ft-color-primary);
  color: var(--ft-color-primary);
  box-shadow: 2px 2px 0 var(--ft-color-secondary);
}

.auth-form label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.auth-form input {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.auth-form__message {
  margin: 0;
  color: var(--zine-stamp-red);
}

.auth-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 820px) {
  .auth-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .auth-panel {
    gap: 20px;
    padding: 18px;
  }

  .auth-panel__intro h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .auth-panel__intro p {
    font-size: 22px;
  }

  .auth-form__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
