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
});
