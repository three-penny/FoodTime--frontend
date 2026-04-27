import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CanteenDetailView from './CanteenDetailView.vue';

describe('CanteenDetailView', () => {
  it('renders the default stall list for every canteen detail page', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/canteens/:canteenId',
          name: 'canteenDetail',
          component: CanteenDetailView,
        },
        {
          path: '/canteens/:canteenId/dishes',
          name: 'dishList',
          component: { template: '<div />' },
        },
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: { template: '<div />' },
        },
      ],
    });
    await router.push('/canteens/minghu');
    await router.isReady();

    const wrapper = shallowMount(CanteenDetailView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          CanteenStallCard: true,
        },
      },
    });

    const cards = wrapper.findAllComponents({ name: 'CanteenStallCard' });
    expect(wrapper.find('[data-test="canteen-stalls"]').exists()).toBe(true);
    expect(cards).toHaveLength(9);
    expect(cards.map((card) => card.props('stall').name)).toEqual([
      '西北面食',
      '费大叔湘菜',
      '山东菜',
      '云南炒饭',
      '云南米线',
      '炙烤五花肉',
      '小谷姐姐麻辣烫',
      '牛肉汤',
      '库迪咖啡',
    ]);
  });
});
