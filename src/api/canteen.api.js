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
