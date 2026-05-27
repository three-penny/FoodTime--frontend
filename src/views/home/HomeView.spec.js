import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomeView from './HomeView.vue';
import { useCanteenStore } from '../../store/useCanteenStore';

const { MOCK_CANTEENS } = vi.hoisted(() => ({
  MOCK_CANTEENS: [
    { id: 'xueyi', name: '学一餐厅', shortName: '学一', imageUrl: '食堂1.png', image: '', rating: 4.6, location: '明湖一层', openHours: '06:30-21:30', avgPrice: '人均¥12-18', peakQueue: '11:45-12:15', bestTime: '11:20前', summary: 'test', rant: '', features: ['家常'], signatureDishes: [], studentNotes: [], introBlocks: [] },
    { id: 'minghu', name: '明湖餐厅', shortName: '明湖', imageUrl: '食堂2.png', image: '', rating: 4.7, location: '明湖二层', openHours: '10:30-21:30', avgPrice: '人均¥14-20', peakQueue: '11:45-12:40', bestTime: '11:25前', summary: 'test', rant: '', features: ['风味'], signatureDishes: [], studentNotes: [], introBlocks: [] },
    { id: 'dongkuai', name: '东快餐厅', shortName: '东快', imageUrl: '食堂3.png', image: '', rating: 4.7, location: '明湖二层', openHours: '10:30-21:30', avgPrice: '人均¥16-28', peakQueue: '11:45-12:15', bestTime: '11:20前', summary: 'test', rant: '', features: [], signatureDishes: [], studentNotes: [], introBlocks: [] },
    { id: 'liuyuan', name: '留园餐厅', shortName: '留园', imageUrl: '食堂3.png', image: '', rating: 4.8, location: '学四北侧', openHours: '10:30-20:00', avgPrice: '人均¥18-35', peakQueue: '11:45-12:20', bestTime: '12:45后', summary: 'test', rant: '', features: [], signatureDishes: [], studentNotes: [], introBlocks: [] },
    { id: 'dongqu', name: '东区餐厅', shortName: '东区', imageUrl: '食堂2.png', image: '', rating: 4.6, location: '东区操场西侧', openHours: '07:00-21:30', avgPrice: '人均¥13-18', peakQueue: '11:45-12:15', bestTime: '11:20前', summary: 'test', rant: '', features: [], signatureDishes: [], studentNotes: [], introBlocks: [] },
    { id: 'yimin', name: '益民餐厅', shortName: '益民', imageUrl: '食堂4.png', image: '', rating: 4.4, location: '明湖东侧', openHours: '10:30-19:30', avgPrice: '人均¥16-30', peakQueue: '11:45-12:30', bestTime: '11:25前', summary: 'test', rant: '', features: [], signatureDishes: [], studentNotes: [], introBlocks: [] },
  ],
}));

function seedCanteenStore() {
  const store = useCanteenStore();
  store.canteens = MOCK_CANTEENS;
  store.homeCanteenSpots = MOCK_CANTEENS.map(c => ({ ...c, canteenId: c.id }));
}

vi.mock('../../api/canteen.api', () => ({
  fetchCanteens: vi.fn().mockResolvedValue({ data: MOCK_CANTEENS }),
  fetchCanteenById: vi.fn().mockResolvedValue({ data: MOCK_CANTEENS[0] }),
  fetchCanteenSpots: vi.fn().mockResolvedValue({ data: MOCK_CANTEENS.map(c => ({ ...c, canteenId: c.id })) }),
  fetchStallsByCanteen: vi.fn().mockResolvedValue({ data: [] }),
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

vi.mock('../../api/rant.api', () => ({
  fetchRants: vi.fn().mockResolvedValue({ data: [] }),
  createRant: vi.fn().mockResolvedValue({ data: null }),
  auditRant: vi.fn().mockResolvedValue({}),
}));

afterEach(() => {
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
        {
          path: '/rants',
          name: 'rantWall',
          component: { template: '<div />' },
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
    await flushPromises();
    await nextTick();

    expect(wrapper.find('[data-test="home-view"]').exists()).toBe(true);
    expect(wrapper.find('#recommend').exists()).toBe(true);
    expect(wrapper.find('#canteens').exists()).toBe(true);
    expect(wrapper.find('#ranking').exists()).toBe(true);
    expect(wrapper.find('#message').exists()).toBe(true);
    expect(wrapper.find('[data-test="home-rant-preview"]').exists()).toBe(true);
  });

  it('uses the requested four canteens for the detailed intro section', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    seedCanteenStore();
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
        plugins: [pinia, router],
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
    const pinia = createPinia();
    setActivePinia(pinia);
    seedCanteenStore();
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
        plugins: [pinia, router],
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
    await flushPromises();

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
