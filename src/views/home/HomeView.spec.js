import { mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import HomeView from './HomeView.vue';

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/reviews',
        name: 'reviewEntry',
        component: HomeView,
      },
      {
        path: '/profile',
        name: 'profileCenter',
        component: HomeView,
      },
      {
        path: '/canteens/:canteenId',
        name: 'canteenDetail',
        component: HomeView,
      },
      {
        path: '/canteens/:canteenId/dishes/:dishId',
        name: 'dishDetail',
        component: HomeView,
      },
    ],
  });
}

describe('HomeView', () => {
  it('renders magazine-style homepage sections and design details', async () => {
    const router = createTestRouter();
    await router.push('/');
    await router.isReady();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find('#feature-dishes').exists()).toBe(true);
    expect(wrapper.find('#canteen-diary').exists()).toBe(true);
    expect(wrapper.find('#hot-ranking').exists()).toBe(true);
    expect(wrapper.find('#errata-board').exists()).toBe(true);
    expect(wrapper.find('#daily-menu').exists()).toBe(false);

    expect(wrapper.findAll('.sticker-note').length).toBeGreaterThanOrEqual(5);
    expect(wrapper.findAll('.torn-edge').length).toBeGreaterThanOrEqual(5);
    expect(wrapper.findAll('.square-stamp').length).toBeGreaterThanOrEqual(10);
    expect(wrapper.findAll('.score-line').length).toBeGreaterThanOrEqual(10);
    expect(wrapper.findAll('img').length).toBeGreaterThanOrEqual(9);

    expect(wrapper.text()).toContain('北交干饭吧');
    expect(wrapper.text()).toContain('学生吐槽');
  });
});
