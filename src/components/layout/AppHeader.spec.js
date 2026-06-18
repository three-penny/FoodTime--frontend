import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppHeader from './AppHeader.vue';

vi.mock('../../api/message.api', () => ({
  fetchMessages: vi.fn(() => Promise.resolve({ data: [] })),
}));

function createRouterForTest() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'homeCanteenSelect',
        component: { template: '<main />' },
      },
      {
        path: '/reviews/new',
        name: 'reviewCreate',
        component: { template: '<main />' },
      },
      {
        path: '/messages',
        name: 'messageCenter',
        component: { template: '<main />' },
      },
      {
        path: '/dishes/upload',
        name: 'dishUpload',
        component: { template: '<main />' },
      },
      {
        path: '/submissions',
        name: 'userSubmissions',
        component: { template: '<main />' },
      },
      {
        path: '/profile',
        name: 'profile',
        component: { template: '<main />' },
      },
      {
        path: '/login',
        name: 'login',
        component: { template: '<main />' },
      },
      {
        path: '/register',
        name: 'register',
        component: { template: '<main />' },
      },
    ],
  });
}

beforeEach(() => {
  window.localStorage.clear();
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AppHeader', () => {
  it('requests recommendation section scroll when recommendation nav is clicked again', async () => {
    const router = createRouterForTest();
    await router.push({
      name: 'homeCanteenSelect',
      query: { section: 'recommend' },
    });
    await router.isReady();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    const recommendButton = wrapper
      .findAll('.nav__item')
      .find(button => button.text().includes('推荐'));

    await recommendButton.trigger('click');
    await flushPromises();

    const requestEvent = dispatchSpy.mock.calls
      .map(([event]) => event)
      .find(event => event.type === 'foodtime:home-section-request');

    expect(requestEvent.detail).toEqual({
      section: 'recommend',
    });
  });

  it('requests recommendation section scroll from the mobile tabbar', async () => {
    const router = createRouterForTest();
    await router.push({
      name: 'homeCanteenSelect',
      query: { section: 'recommend' },
    });
    await router.isReady();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    const recommendButton = wrapper
      .findAll('.mobile-tabbar__item')
      .find(button => button.text().includes('推荐'));

    await recommendButton.trigger('click');
    await flushPromises();

    const requestEvent = dispatchSpy.mock.calls
      .map(([event]) => event)
      .find(event => event.type === 'foodtime:home-section-request');

    expect(requestEvent.detail).toEqual({
      section: 'recommend',
    });
  });

  it('navigates profile button to profile page', async () => {
    const router = createRouterForTest();
    await router.push({ name: 'homeCanteenSelect' });
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    await wrapper.find('.profile').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('profile');
  });

  it('navigates mobile profile tab to profile page', async () => {
    const router = createRouterForTest();
    await router.push({ name: 'homeCanteenSelect' });
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    const profileTab = wrapper
      .findAll('.mobile-tabbar__item')
      .find(button => button.text().includes('我的'));

    await profileTab.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('profile');
  });

  it('hides platform navigation on auth pages', async () => {
    const router = createRouterForTest();
    await router.push({ name: 'login' });
    await router.isReady();

    const wrapper = mount(AppHeader, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    expect(wrapper.find('.nav').exists()).toBe(false);
    expect(wrapper.find('.mobile-tabbar').exists()).toBe(false);
    expect(wrapper.find('.profile').exists()).toBe(false);
  });
});
