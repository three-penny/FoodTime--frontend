import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../views/home/HomeView.vue');
const CanteenDetailView = () => import('../views/canteen/CanteenDetailView.vue');
const DishListView = () => import('../views/dish/DishListView.vue');
const DishDetailView = () => import('../views/dish/DishDetailView.vue');

export const routes = [
  {
    path: '/',
    name: 'homeCanteenSelect',
    component: HomeView,
  },
  {
    path: '/canteens/:canteenId',
    name: 'canteenDetail',
    component: CanteenDetailView,
  },
  {
    path: '/canteens/:canteenId/dishes',
    name: 'dishList',
    component: DishListView,
  },
  {
    path: '/canteens/:canteenId/dishes/:dishId',
    name: 'dishDetail',
    component: DishDetailView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
