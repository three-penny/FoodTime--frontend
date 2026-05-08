// @author Codex

import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import CanteenCarousel from './CanteenCarousel.vue';
import { CANTEENS } from '../../mock/canteens.mock';

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
        path: '/canteens/:canteenId/dishes',
        name: 'dishList',
        component: { template: '<main />' },
      },
    ],
  });
}

function createItem(overrides = {}) {
  const canteen = CANTEENS[0];

  return {
    id: `${canteen.id}-spot`,
    canteenId: canteen.id,
    name: canteen.name,
    image: 'https://example.com/canteen.jpg',
    rating: 4.6,
    price: 12,
    valueNote: '出餐快',
    comment: '饭点排队会变长，但出餐速度稳定，赶课前吃一顿很安心。',
    recommendVotes: 999,
    ...overrides,
  };
}

async function mountCarousel(items = [createItem()]) {
  const router = createRouterForTest();
  await router.push('/');
  await router.isReady();

  const wrapper = mount(CanteenCarousel, {
    props: {
      items,
    },
    global: {
      plugins: [router],
    },
  });

  return { wrapper, router };
}

describe('CanteenCarousel', () => {
  it('renders full canteen names without recommend count', async () => {
    const item = createItem();
    const { wrapper } = await mountCarousel([item]);

    expect(wrapper.find('.canteen-card__title-row h3').text()).toBe(item.name);
    expect(wrapper.text()).not.toContain('·');
    expect(wrapper.text()).not.toContain('999');
  });

  it('shows comment text and character count', async () => {
    const { wrapper } = await mountCarousel();

    expect(wrapper.find('.canteen-card__rant-text').text()).toContain('饭点排队');
    expect(wrapper.find('.canteen-card__count').text()).toMatch(/\d+字/);
  });

  it('opens the selected canteen dish list route', async () => {
    const item = createItem({ canteenId: 'minghu' });
    const { wrapper, router } = await mountCarousel([item]);

    await wrapper.find('.canteen-card').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishList');
    expect(router.currentRoute.value.params.canteenId).toBe('minghu');
  });

  it('still navigates when pointer moves less than drag threshold', async () => {
    const item = createItem({ canteenId: 'minghu' });
    const { wrapper, router } = await mountCarousel([item]);
    const track = wrapper.find('.canteen-carousel__track');

    await track.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 1 });
    await track.trigger('pointermove', { clientX: 104, pointerId: 1 });
    await track.trigger('pointerup', { clientX: 104, pointerId: 1 });

    await wrapper.find('.canteen-card').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishList');
    expect(router.currentRoute.value.params.canteenId).toBe('minghu');
  });

  it('does not navigate after a real drag gesture', async () => {
    const item = createItem({ canteenId: 'minghu' });
    const { wrapper, router } = await mountCarousel([item]);
    const track = wrapper.find('.canteen-carousel__track');

    await track.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 2 });
    await track.trigger('pointermove', { clientX: 80, pointerId: 2 });
    await track.trigger('pointerup', { clientX: 80, pointerId: 2 });
    await wrapper.find('.canteen-card').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('homeCanteenSelect');
  });

  it('duplicates cards for seamless uniform auto-scroll', async () => {
    const { wrapper } = await mountCarousel([
      createItem({ id: 'canteen-a' }),
      createItem({ id: 'canteen-b' }),
    ]);

    expect(wrapper.findAll('.canteen-card')).toHaveLength(4);
  });

  it('opens detail route from duplicated cards in the second loop', async () => {
    const first = createItem({ id: 'canteen-a', canteenId: 'minghu' });
    const second = createItem({ id: 'canteen-b', canteenId: 'liuyuan' });
    const { wrapper, router } = await mountCarousel([first, second]);
    const cards = wrapper.findAll('.canteen-card');

    await cards[2].trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishList');
    expect(router.currentRoute.value.params.canteenId).toBe('minghu');
  });
});
