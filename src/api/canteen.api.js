import http from './http';

export function fetchCanteens() {
  return http.get('/canteens');
}

export function fetchCanteenById(id) {
  return http.get(`/canteens/${id}`);
}

export function fetchCanteenSpots() {
  return http.get('/canteens/spots');
}

export function fetchStallsByCanteen(canteenId) {
  return http.get(`/canteens/${canteenId}/stalls`);
}

export function fetchCanteenDishes(canteenId) {
  return http.get(`/canteens/${canteenId}/dishes`);
}

export function fetchRankings() {
  return http.get('/rankings');
}

export function fetchDailyRecommendations() {
  return http.get('/recommendations/daily');
}

export function fetchWeeklyRecommendations() {
  return http.get('/recommendations/weekly');
}

export function deleteStall(stallId) {
  return http.delete(`/stalls/${stallId}`);
}

export function createCanteen(data) {
  return http.post('/canteens', data);
}

export function createStall(canteenId, data) {
  return http.post(`/canteens/${canteenId}/stalls`, data);
}
