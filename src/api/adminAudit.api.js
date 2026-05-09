// @author XXXXX

import axios from 'axios';

const adminAuditClient = axios.create({
  baseURL: '/api/admin',
});

/**
 * 管理员审核接口占位封装。
 * 当前页面仍使用 Pinia mock 数据，后端接入时可在 store 中替换为以下方法。
 */
export function fetchDishSubmissions(params) {
  return adminAuditClient.get('/dish-submissions', { params });
}

export function approveDishSubmission(submissionId, payload) {
  return adminAuditClient.post(`/dish-submissions/${submissionId}/approve`, payload);
}

export function rejectDishSubmission(submissionId, payload) {
  return adminAuditClient.post(`/dish-submissions/${submissionId}/reject`, payload);
}

export function fetchRantAudits(params) {
  return adminAuditClient.get('/rants', { params });
}

export function approveRantAudit(rantId, payload) {
  return adminAuditClient.post(`/rants/${rantId}/approve`, payload);
}

export function rejectRantAudit(rantId, payload) {
  return adminAuditClient.post(`/rants/${rantId}/reject`, payload);
}
