import http from './http';

export function fetchPoints(userId) {
  return http.get('/points', { params: { userId } });
}

export function fetchPointsHistory(userId) {
  return http.get('/points/history', { params: { userId } });
}

export function dailyCheckin(userId) {
  return http.post('/points/checkin', { userId });
}

export function consumePoints(userId, amount, reason) {
  return http.post('/points/consume', { userId, amount, reason });
}
