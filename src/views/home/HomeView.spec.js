import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomeView from './HomeView.vue';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

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
    expect(introGrid.props('canteens').map((canteen) => canteen.id)).toEqual([
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
    const names = carousel.props('items').map((item) => item.name);

    expect(names[0]).toBe('学一餐厅');
    expect(names.every((name) => !name.includes('·'))).toBe(true);
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
        .every((item) => Boolean(item?.id) && Boolean(item?.canteenId)),
    ).toBe(true);
    expect(
      recommendationCarousel
        .props('items')
        .every((item) => Boolean(item?.id) && Boolean(item?.canteenId)),
    ).toBe(true);
  });

  it('scrolls to recommendation section from a repeated header request', async () => {
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
    await router.push({
      name: 'homeCanteenSelect',
      query: { section: 'recommend' },
    });
    await router.isReady();
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    const wrapper = shallowMount(HomeView, {
      attachTo: document.body,
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
    await nextTick();

    window.dispatchEvent(
      new CustomEvent('foodtime:home-section-request', {
        detail: {
          section: 'recommend',
        },
      }),
    );
    await nextTick();
    await nextTick();

    expect(scrollSpy).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });
    wrapper.unmount();
  });
});
