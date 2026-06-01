import http from './http';

export function listUsers(params = {}) {
  return http.get('/superadmin/users', { params });
}

export function setUserRole(userId, role) {
  return http.put(`/superadmin/users/${userId}/role`, { role });
}

export function setUserStatus(userId, status) {
  return http.put(`/superadmin/users/${userId}/status`, { status });
}

export function listAuditLogs(params = {}) {
  return http.get('/superadmin/logs', { params });
}

export function getDashboard() {
  return http.get('/superadmin/dashboard');
}

export function changeUserPassword(userId, password) {
  return http.put(`/superadmin/users/${userId}/password`, { password });
}
