import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HomeView from './HomeView.vue';

describe('HomeView', () => {
  it('renders key homepage sections', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: HomeView,
        },
      ],
    });
    await router.push('/');
    await router.isReady();

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          HomeHero: true,
          TodayRecommendationCarousel: true,
          CanteenCarousel: true,
          CanteenIntroGrid: true,
          HomeRankingList: true,
        },
      },
    });

    expect(wrapper.find('[data-test="home-view"]').exists()).toBe(true);
    expect(wrapper.find('#recommend').exists()).toBe(true);
    expect(wrapper.find('#canteens').exists()).toBe(true);
    expect(wrapper.find('#ranking').exists()).toBe(true);
    expect(wrapper.find('#message').exists()).toBe(true);
  });

  it('uses the requested four canteens for the detailed intro section', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: HomeView,
        },
      ],
    });
    await router.push('/');
    await router.isReady();

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          HomeHero: true,
          TodayRecommendationCarousel: true,
          CanteenCarousel: true,
          CanteenIntroGrid: true,
          HomeRankingList: true,
        },
      },
    });

    const introGrid = wrapper.findComponent({ name: 'CanteenIntroGrid' });
    expect(introGrid.props('canteens').map(canteen => canteen.id)).toEqual([
      'minghu',
      'liuyuan',
      'dongqu',
      'yimin',
    ]);
  });

  it('uses full canteen names in the canteen carousel', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: HomeView,
        },
      ],
    });
    await router.push('/');
    await router.isReady();

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          HomeHero: true,
          TodayRecommendationCarousel: true,
          CanteenCarousel: true,
          CanteenIntroGrid: true,
          HomeRankingList: true,
        },
      },
    });

    const carousel = wrapper.findComponent({ name: 'CanteenCarousel' });
    const names = carousel.props('items').map(item => item.name);

    expect(names[0]).toBe('学一餐厅');
    expect(names.every(name => !name.includes('·'))).toBe(true);
  });
  it('passes only routable items to carousel components', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: HomeView,
        },
      ],
    });
    await router.push('/');
    await router.isReady();

    const wrapper = shallowMount(HomeView, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          HomeHero: true,
          TodayRecommendationCarousel: true,
          CanteenCarousel: true,
          CanteenIntroGrid: true,
          HomeRankingList: true,
        },
      },
    });

    const canteenCarousel = wrapper.findComponent({ name: 'CanteenCarousel' });
    const recommendationCarousel = wrapper.findComponent({
      name: 'TodayRecommendationCarousel',
    });

    expect(
      canteenCarousel
        .props('items')
        .every(item => Boolean(item?.id) && Boolean(item?.canteenId))
    ).toBe(true);
    expect(
      recommendationCarousel
        .props('items')
        .every(item => Boolean(item?.id) && Boolean(item?.canteenId))
    ).toBe(true);
  });
});
