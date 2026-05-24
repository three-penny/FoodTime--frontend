import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import DishListView from './DishListView.vue';

vi.mock('../../api/canteen.api', () => ({
  fetchCanteenById: vi.fn().mockResolvedValue({
    data: {
      id: 'xueyi',
      name: '学一餐厅',
      shortName: '学一',
      imageUrl: '食堂1.png',
      rating: 4.6,
      location: '明湖餐厅一层',
      openHours: '06:30 - 21:30',
      avgPrice: '人均 ¥12 - ¥18',
      peakQueue: '11:45 - 12:15',
      bestTime: '11:20 前、12:40 后',
    },
  }),
  fetchStallsByCanteen: vi.fn().mockResolvedValue({
    data: [
      { id: 'stall-1', name: '西北面食', avgPrice: '¥12-20', bestTime: '11:20前', summary: 'test', dishes: [] },
      { id: 'stall-2', name: '费大叔湘菜', avgPrice: '¥16-26', bestTime: '12:40后', summary: 'test', dishes: [] },
      { id: 'stall-3', name: '山东菜', avgPrice: '¥13-22', bestTime: '11:30前', summary: 'test', dishes: [] },
      { id: 'stall-4', name: '云南炒饭', avgPrice: '¥12-19', bestTime: '13:00后', summary: 'test', dishes: [] },
      { id: 'stall-5', name: '云南米线', avgPrice: '¥14-24', bestTime: '晚饭错峰', summary: 'test', dishes: [] },
      { id: 'stall-6', name: '炙烤五花肉', avgPrice: '¥18-28', bestTime: '11:15前', summary: 'test', dishes: [] },
      { id: 'stall-7', name: '小谷姐姐麻辣烫', avgPrice: '¥16-30', bestTime: '避开12:00', summary: 'test', dishes: [] },
      { id: 'stall-8', name: '牛肉汤', avgPrice: '¥15-25', bestTime: '早餐后段', summary: 'test', dishes: [] },
      { id: 'stall-9', name: '库迪咖啡', avgPrice: '¥9-18', bestTime: '下午15:00', summary: 'test', dishes: [] },
    ],
  }),
  fetchCanteens: vi.fn().mockResolvedValue({ data: [] }),
  fetchCanteenSpots: vi.fn().mockResolvedValue({ data: [] }),
  fetchCanteenDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchRankings: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('../../api/dish.api', () => ({
  fetchDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchTopDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchDishById: vi.fn().mockResolvedValue({ data: null }),
  fetchDishReviews: vi.fn().mockResolvedValue({ data: [] }),
  recommendDish: vi.fn().mockResolvedValue({}),
  avoidDish: vi.fn().mockResolvedValue({}),
}));

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
    await flushPromises();

    const cards = wrapper.findAllComponents({ name: 'CanteenStallCard' });
    expect(wrapper.find('[data-test="dish-list-stalls"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('学一餐厅');
    expect(cards).toHaveLength(9);
    expect(cards[0].props('stall').name).toBe('西北面食');
  });
});
