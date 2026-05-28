import http from './http';

export function fetchDishes(limit = 50) {
  return http.get('/dishes', { params: { limit } });
}

export function fetchTopDishes(limit = 10) {
  return http.get('/dishes/top', { params: { limit } });
}

export function fetchDishById(id) {
  return http.get(`/dishes/${id}`);
}

export function fetchDishReviews(dishId) {
  return http.get(`/dishes/${dishId}/reviews`);
}

export function recommendDish(dishId) {
  return http.post(`/dishes/${dishId}/recommend`);
}

export function avoidDish(dishId) {
  return http.post(`/dishes/${dishId}/avoid`);
}

export function deleteDish(dishId) {
  return http.delete(`/dishes/${dishId}`);
}
