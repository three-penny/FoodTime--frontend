import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../views/home/HomeView.vue');
const CanteenDetailView = () =>
  import('../views/canteen/CanteenDetailView.vue');
const DishListView = () => import('../views/dish/DishListView.vue');
const DishDetailView = () => import('../views/dish/DishDetailView.vue');
const ProfileCenterView = () =>
  import('../views/profile/ProfileCenterView.vue');
const ReviewEntryView = () => import('../views/review/ReviewEntryView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页 / 北交干饭吧',
    },
  },
  {
    path: '/canteens/:canteenId',
    name: 'canteenDetail',
    component: CanteenDetailView,
    meta: {
      title: '食堂档案',
    },
  },
  {
    path: '/canteens/:canteenId/dishes',
    name: 'dishList',
    component: DishListView,
    meta: {
      title: '菜单价目表',
    },
  },
  {
    path: '/canteens/:canteenId/dishes/:dishId',
    name: 'dishDetail',
    component: DishDetailView,
    meta: {
      title: '单品档案',
    },
  },
  {
    path: '/profile',
    name: 'profileCenter',
    component: ProfileCenterView,
    meta: {
      title: '学生证副页',
    },
  },
  {
    path: '/reviews',
    name: 'reviewEntry',
    component: ReviewEntryView,
    meta: {
      title: '投稿与勘误',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  document.title = `${to.meta?.title || '北交干饭吧'} | 北交干饭吧`;
});

export default router;
