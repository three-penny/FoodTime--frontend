import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppHeader from './AppHeader.vue';

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
    ],
  });
}

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
        plugins: [router],
      },
    });

    const recommendButton = wrapper
      .findAll('.nav__item')
      .find((button) => button.text().includes('推荐'));

    await recommendButton.trigger('click');
    await flushPromises();

    const requestEvent = dispatchSpy.mock.calls
      .map(([event]) => event)
      .find((event) => event.type === 'foodtime:home-section-request');

    expect(requestEvent.detail).toEqual({
      section: 'recommend',
    });
  });
});
