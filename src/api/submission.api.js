/**
 * submission.api
 * 职责：封装菜品提报相关 HTTP 请求（图片上传、表单提交、列表查询）。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-05-23
 * 依赖：http.js
 */
import http from './http';

/**
 * 创建菜品提报（支持图片文件上传）。
 * axios 使用 FormData 时会自动设置正确的 Content-Type（含 boundary）。
 * @param {FormData} formData 包含菜品信息与图片文件的 FormData
 * @returns {Promise<Object>} 返回创建成功的提报记录
 */
export function createSubmission(formData) {
  return http.post('/submissions', formData);
}

/**
 * 查询当前用户的提报列表。
 * @param {string} account 用户账号
 * @returns {Promise<Object>} 返回包含 items 和统计信息的分页结构
 */
export function fetchMySubmissions(account) {
  return http.get('/submissions', { params: { account } });
}
