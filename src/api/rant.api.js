import http from './http';

export function fetchRants(status) {
  const params = {};
  if (status) params.status = status;
  return http.get('/rants', { params });
}

export function createRant({ canteenName, author, content, tag }) {
  return http.post('/rants', { canteenName, author, content, tag });
}

export function auditRant(rantId, { status, reason, auditor }) {
  return http.put(`/rants/${rantId}/audit`, { status, reason, auditor });
}
