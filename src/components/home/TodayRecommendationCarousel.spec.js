// @author Codex

import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import TodayRecommendationCarousel from './TodayRecommendationCarousel.vue';

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
        path: '/canteens/:canteenId/dishes/:dishId',
        name: 'dishDetail',
        component: { template: '<main />' },
      },
    ],
  });
}

function createItem(overrides = {}) {
  return {
    id: 'tomato-beef-rice',
    canteenId: 'jiaogong',
    canteenName: '教工餐厅',
    stall: '酸甜稳妥',
    name: '番茄肥牛饭',
    image: 'https://example.com/dish.jpg',
    rating: 4.8,
    price: 18,
    comment: '课间冲过去五分钟拿到，效率党福音。',
    tags: ['必吃'],
    ...overrides,
  };
}

async function mountCarousel(items = [createItem()]) {
  const router = createRouterForTest();
  await router.push('/');
  await router.isReady();

  const wrapper = mount(TodayRecommendationCarousel, {
    props: {
      items,
    },
    global: {
      plugins: [router],
    },
  });

  return { wrapper, router };
}

describe('TodayRecommendationCarousel', () => {
  it('renders canteen and stall without count or bottom tags', async () => {
    const { wrapper } = await mountCarousel();

    expect(wrapper.find('.recommend-card__meta').text()).toBe(
      '教工餐厅 · 酸甜稳妥 · ¥18',
    );
    expect(wrapper.find('.recommend-card__comment span').exists()).toBe(false);
    expect(wrapper.find('.recommend-card__tags').exists()).toBe(false);
  });

  it('opens the selected dish detail route', async () => {
    const { wrapper, router } = await mountCarousel();

    await wrapper.find('.recommend-card').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishDetail');
    expect(router.currentRoute.value.params).toMatchObject({
      canteenId: 'jiaogong',
      dishId: 'tomato-beef-rice',
    });
  });

  it('duplicates cards for seamless uniform auto-scroll', async () => {
    const { wrapper } = await mountCarousel([
      createItem({ id: 'dish-a' }),
      createItem({ id: 'dish-b' }),
    ]);

    expect(wrapper.findAll('.recommend-card')).toHaveLength(4);
  });

  it('opens route from duplicated cards in the second loop', async () => {
    const first = createItem({ id: 'dish-a', canteenId: 'minghu' });
    const second = createItem({ id: 'dish-b', canteenId: 'liuyuan' });
    const { wrapper, router } = await mountCarousel([first, second]);
    const cards = wrapper.findAll('.recommend-card');

    await cards[2].trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishDetail');
    expect(router.currentRoute.value.params).toMatchObject({
      canteenId: 'minghu',
      dishId: 'dish-a',
    });
  });
});
