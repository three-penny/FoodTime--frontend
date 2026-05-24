import http from './http';

export function fetchMessages() {
  return http.get('/messages');
}
