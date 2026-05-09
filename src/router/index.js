// @author XXXXX

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/useAuthStore';

const HomeView = () => import('../views/home/HomeView.vue');
const CanteenDetailView = () => import('../views/canteen/CanteenDetailView.vue');
const DishListView = () => import('../views/dish/DishListView.vue');
const DishDetailView = () => import('../views/dish/DishDetailView.vue');
const ReviewCreateView = () => import('../views/review/ReviewCreateView.vue');
const MessageCenterView = () => import('../views/message/MessageCenterView.vue');
const RantWallView = () => import('../views/rant/RantWallView.vue');
const LoginView = () => import('../views/auth/LoginView.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');
const DishUploadView = () => import('../views/submission/DishUploadView.vue');
const UserSubmissionView = () =>
  import('../views/submission/UserSubmissionView.vue');

export const routes = [
  {
    path: '/',
    name: 'homeCanteenSelect',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/canteens',
    name: 'homeCanteenAnchor',
    redirect: {
      name: 'homeCanteenSelect',
      query: {
        section: 'canteens',
      },
    },
  },
  {
    path: '/canteens/:canteenId',
    name: 'canteenDetail',
    component: CanteenDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/canteens/:canteenId/dishes',
    name: 'dishList',
    component: DishListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/canteens/:canteenId/dishes/:dishId',
    name: 'dishDetail',
    component: DishDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/reviews/new',
    name: 'reviewCreate',
    component: ReviewCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/dishes/upload',
    name: 'dishUpload',
    component: DishUploadView,
    meta: { requiresAuth: true },
  },
  {
    path: '/submissions',
    name: 'userSubmissions',
    component: UserSubmissionView,
    meta: { requiresAuth: true },
  },
  {
    path: '/messages',
    name: 'messageCenter',
    component: MessageCenterView,
    meta: { requiresAuth: true },
  },
  {
    path: '/rants',
    name: 'rantWall',
    component: RantWallView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFoundRedirect',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    };
  }

  if (
    authStore.isAuthenticated &&
    (to.name === 'login' || to.name === 'register')
  ) {
    return { name: 'homeCanteenSelect' };
  }

  return true;
});

export default router;
