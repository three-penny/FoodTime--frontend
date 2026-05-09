<!-- @author XXXXX -->

<template>
  <section class="auth-view">
    <div class="section-rule">
      <span class="section-rule__index">01</span>
      <span class="section-rule__line"></span>
    </div>

    <article class="auth-panel torn-edge">
      <div class="auth-panel__intro">
        <span class="sticker sticker--r1">账号登记</span>
        <h1>注册账号</h1>
        <p class="handwrite">
          用户注册后可进入用户侧；管理员注册需要邀请码，审核台用于处理投稿和吐槽墙内容。
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="auth-tabs" aria-label="注册身份">
          <button
            class="auth-tabs__item"
            :class="{ 'is-active': form.role === 'user' }"
            type="button"
            @click="form.role = 'user'"
          >
            用户注册
          </button>
          <button
            class="auth-tabs__item"
            :class="{ 'is-active': form.role === 'admin' }"
            type="button"
            @click="form.role = 'admin'"
          >
            管理员注册
          </button>
        </div>

        <label>
          <span>昵称</span>
          <input v-model.trim="form.nickname" type="text" autocomplete="nickname" />
        </label>
        <label>
          <span>{{ form.role === 'admin' ? '管理员账号' : '学号' }}</span>
          <input v-model.trim="form.account" type="text" />
        </label>
        <label v-if="form.role === 'admin'">
          <span>管理员邀请码</span>
          <input v-model.trim="form.inviteCode" type="text" />
        </label>
        <label>
          <span>密码</span>
          <input
            v-model.trim="form.password"
            type="password"
            autocomplete="new-password"
          />
        </label>
        <label>
          <span>确认密码</span>
          <input
            v-model.trim="form.confirmPassword"
            type="password"
            autocomplete="new-password"
          />
        </label>
        <p v-if="message" class="auth-form__message">{{ message }}</p>
        <div class="auth-form__actions">
          <button class="button-ink is-primary" type="submit">完成注册</button>
          <button class="button-ink" type="button" @click="goLogin">
            返回登录
          </button>
        </div>
      </form>
    </article>
  </section>
</template>

<script setup>
/**
 * RegisterView
 * 职责：提供用户和管理员两类注册入口，并对管理员邀请码做前端校验。
 * 作者：XXXXX
 * 使用场景：新用户首次进入 FoodTime 用户侧前登记账号。
 * 依赖：Pinia、Vue Router、useAuthStore。
 */
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/useAuthStore';

defineOptions({
  name: 'RegisterView',
});

const router = useRouter();
const authStore = useAuthStore();
const message = ref('');
const form = reactive({
  role: 'user',
  nickname: '',
  account: '',
  inviteCode: '',
  password: '',
  confirmPassword: '',
});

function handleRegister() {
  if (!form.nickname || !form.account || !form.password) {
    message.value = '请补全昵称、账号和密码。';
    return;
  }

  if (form.password !== form.confirmPassword) {
    message.value = '两次输入的密码不一致。';
    return;
  }

  if (form.role === 'admin' && !authStore.validateAdminInvite(form.inviteCode)) {
    message.value = '管理员邀请码不正确。';
    return;
  }

  message.value =
    form.role === 'admin'
      ? '管理员注册信息已校验，请返回登录进入审核台。'
      : '用户注册成功，请返回登录。';
  router.push({ name: 'login' });
}

function goLogin() {
  router.push({ name: 'login' });
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
  gap: 14px;
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
