import http from './http';

export function createReview({ dishId, userId, rating, comment }) {
  return http.post('/reviews', { dishId, userId, rating, comment });
}
