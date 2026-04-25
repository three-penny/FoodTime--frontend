import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import CanteenDetailView from './canteen/CanteenDetailView.vue';
import DishDetailView from './dish/DishDetailView.vue';
import DishListView from './dish/DishListView.vue';
import HomeView from './home/HomeView.vue';
import ProfileCenterView from './profile/ProfileCenterView.vue';
import ReviewEntryView from './review/ReviewEntryView.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
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
      { path: '/reviews', name: 'reviewEntry', component: ReviewEntryView },
      { path: '/profile', name: 'profileCenter', component: ProfileCenterView },
    ],
  });
}

async function mountAt(component, path) {
  const router = createTestRouter();
  await router.push(path);
  await router.isReady();

  return mount(component, {
    global: {
      plugins: [router],
    },
  });
}

describe('route views smoke render', () => {
  it('renders home view', async () => {
    const wrapper = await mountAt(HomeView, '/');
    expect(wrapper.find('#feature-dishes').exists()).toBe(true);
    expect(wrapper.find('#canteen-diary').exists()).toBe(true);
  });

  it('renders canteen detail view', async () => {
    const wrapper = await mountAt(CanteenDetailView, '/canteens/north-garden');
    expect(wrapper.findAll('.score-line').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.vote-actions').length).toBeGreaterThan(0);
  });

  it('renders dish list view', async () => {
    const wrapper = await mountAt(
      DishListView,
      '/canteens/north-garden/dishes',
    );
    expect(wrapper.findAll('.score-line').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.vote-actions').length).toBeGreaterThan(0);
  });

  it('renders dish detail view', async () => {
    const wrapper = await mountAt(
      DishDetailView,
      '/canteens/north-garden/dishes/braised-pork-rice',
    );
    expect(wrapper.findAll('.score-line').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.vote-actions').length).toBeGreaterThan(0);
  });

  it('renders review entry view', async () => {
    const wrapper = await mountAt(ReviewEntryView, '/reviews');
    expect(wrapper.findAll('.score-line').length).toBeGreaterThan(0);
  });

  it('renders profile center view', async () => {
    const wrapper = await mountAt(ProfileCenterView, '/profile');
    expect(wrapper.findAll('.score-line').length).toBeGreaterThan(0);
    expect(wrapper.findAll('.vote-actions').length).toBeGreaterThan(0);
  });
});
