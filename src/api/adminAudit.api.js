import http from './http';

export function auditSubmission(submissionId, { status, reason, auditor }) {
  return http.put(`/submissions/${submissionId}/audit`, { status, reason, auditor });
}

export function auditRant(rantId, { status, reason, auditor }) {
  return http.put(`/rants/${rantId}/audit`, { status, reason, auditor });
}

export function adminCreateSubmission(data) {
  return http.post('/submissions/admin', data);
}

export function editSubmission(submissionId, data) {
  return http.put(`/submissions/${submissionId}`, data);
}

export function editRant(rantId, data) {
  return http.put(`/rants/${rantId}`, data);
}
