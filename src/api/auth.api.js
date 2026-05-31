/**
 * auth.api
 * 职责：封装认证相关 HTTP 请求（注册、登录、验证码）。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-05-23
 * 依赖：http.js
 */
import http from './http';

/**
 * 用户注册。
 * @param {Object} params 注册参数
 * @param {string} params.email 邮箱
 * @param {string} params.password 密码
 * @param {string} params.nickname 昵称
 * @param {string} params.verification_code 验证码
 * @param {string} [params.role] 角色，默认 'user'
 * @returns {Promise<Object>} 返回用户数据
 */
export function register(params) {
  return http.post('/auth/register', params);
}

/**
 * 用户登录。
 * @param {Object} params 登录参数
 * @param {string} params.login_id 邮箱或账号
 * @param {string} params.password 密码
 * @returns {Promise<Object>} 返回用户数据
 */
export function login(params) {
  return http.post('/auth/login', params);
}

/**
 * 发送邮箱验证码。
 * @param {string} email 邮箱地址
 * @returns {Promise<Object>}
 */
export function sendVerificationCode(email) {
  return http.post('/auth/send-code', { email });
}

export function updateProfile(data) {
  return http.put('/auth/profile', data);
}

export function generateInviteCode() {
  return http.post('/auth/invite-code/generate');
}

export function getInviteCode() {
  return http.get('/auth/invite-code');
}
