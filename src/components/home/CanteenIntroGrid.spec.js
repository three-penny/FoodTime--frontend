// @author Codex

import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import CanteenIntroGrid from './CanteenIntroGrid.vue';

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

function createCanteen(overrides = {}) {
  return {
    id: 'minghu',
    name: '明湖餐厅',
    rating: 4.7,
    avgPrice: '人均 ¥14 - ¥20',
    summary: '明湖餐厅位于明湖二层，适合想换换口味点面的同学。',
    peakQueue: '11:45 - 12:40',
    bestTime: '11:25 前，12:45 后',
    openHours: '10:30 - 21:30',
    signatureDishes: ['云南米线', '炒饭'],
    studentNotes: ['云南米线特别正宗', '热门窗口排队明显'],
    introBlocks: [
      {
        title: '食堂定位',
        content: '风味选择丰富，适合做特色展示。',
      },
    ],
    rant: '想吃的很多，但高峰期上楼后经常要排队。',
    image: 'https://example.com/minghu.jpg',
    ...overrides,
  };
}

async function mountGrid(canteens = [createCanteen()]) {
  const router = createRouterForTest();
  await router.push('/');
  await router.isReady();

  const wrapper = mount(CanteenIntroGrid, {
    props: { canteens },
    global: {
      plugins: [router],
    },
  });

  return { wrapper, router };
}

describe('CanteenIntroGrid', () => {
  it('renders canteen photo under the rant area', async () => {
    const item = createCanteen();
    const { wrapper } = await mountGrid([item]);
    const photo = wrapper.find('.canteen-intro__photo');

    expect(photo.exists()).toBe(true);
    expect(photo.attributes('src')).toBe(item.image);
    expect(photo.attributes('alt')).toBe(`${item.name} canteen photo`);
  });

  it('keeps jump button routing to dish list', async () => {
    const { wrapper, router } = await mountGrid();

    await wrapper.find('.button-ink.is-primary').trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('dishList');
    expect(router.currentRoute.value.params.canteenId).toBe('minghu');
  });
});
