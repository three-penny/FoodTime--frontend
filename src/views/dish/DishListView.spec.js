import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DishListView from './DishListView.vue';

describe('DishListView', () => {
  it('renders the stall expansion page on the dish list route', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/canteens/:canteenId/dishes',
          name: 'dishList',
          component: DishListView,
        },
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: { template: '<div />' },
        },
      ],
    });
    await router.push('/canteens/xueyi/dishes');
    await router.isReady();

    const wrapper = shallowMount(DishListView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          CanteenStallCard: true,
        },
      },
    });

    const cards = wrapper.findAllComponents({ name: 'CanteenStallCard' });
    expect(wrapper.find('[data-test="dish-list-stalls"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('学一餐厅');
    expect(cards).toHaveLength(9);
    expect(cards[0].props('stall').name).toBe('西北面食');
  });
});
