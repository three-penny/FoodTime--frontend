// @author XXXXX

import { defineStore } from 'pinia';

const STORAGE_KEY = 'foodtime_auth_session';
export const ADMIN_INVITE_CODE = 'ABCDEF';

function loadSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * useAuthStore
 * 职责：管理前端登录态、用户身份和注册邀请码校验。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：登录页、注册页、路由守卫、顶部导航。
 * 依赖：Pinia、localStorage、auth.api.js
 * 设计说明：登录态通过后端 API 验证后存入 localStorage，后续迁移为后端 token。
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: loadSession(),
  }),
  getters: {
    isAuthenticated(state) {
      return Boolean(state.session?.account);
    },
    currentRole(state) {
      return state.session?.role ?? 'guest';
    },
    displayName(state) {
      return state.session?.nickname || state.session?.account || '用户';
    },
  },
  actions: {
    /**
     * 写入登录态。
     * @param {Object} payload 用户数据（由后端登录/注册接口返回）。
     * @param {string} payload.account 账号。
     * @param {string} payload.role 身份。
     * @param {string} [payload.email] 邮箱。
     * @param {string} [payload.nickname] 昵称。
     * @param {string} [payload.id] 用户 ID。
     * @returns {void}
     */
    login(payload) {
      this.session = {
        id: payload.id,
        account: payload.account,
        email: payload.email || '',
        role: payload.role,
        nickname: payload.nickname || payload.account,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.session));
    },
    /**
     * 清除当前登录态。
     * @returns {void}
     */
    logout() {
      this.session = null;
      window.localStorage.removeItem(STORAGE_KEY);
    },
    /**
     * 校验管理员邀请码。
     * @param {string} inviteCode 邀请码。
     * @returns {boolean} 邀请码是否有效。
     */
    validateAdminInvite(inviteCode) {
      return inviteCode.trim() === ADMIN_INVITE_CODE;
    },
  },
});
