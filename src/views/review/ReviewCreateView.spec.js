import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReviewCreateView from './ReviewCreateView.vue';
import { useDishStore } from '../../store/useDishStore';

describe('ReviewCreateView', () => {
  it('submits star review and returns to the dish comment page', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/reviews/new',
          name: 'reviewCreate',
          component: ReviewCreateView,
        },
        {
          path: '/canteens/:canteenId/dishes/:dishId',
          name: 'dishDetail',
          component: { template: '<div />' },
        },
        {
          path: '/',
          name: 'homeCanteenSelect',
          component: { template: '<div />' },
        },
      ],
    });
    const pinia = createPinia();
    await router.push({
      name: 'reviewCreate',
      query: {
        canteenId: 'xueyi',
        dishId: 'xueyi-northwest-noodles-1',
      },
    });
    await router.isReady();

    const wrapper = mount(ReviewCreateView, {
      global: {
        plugins: [pinia, router],
      },
    });

    await wrapper.find('[aria-label="4.5 星"]').trigger('click');
    await wrapper.find('textarea').setValue('面条筋道，辣香比较明显。');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    const dishStore = useDishStore();
    const reviews = dishStore.getReviewsByDishId('xueyi-northwest-noodles-1');
    expect(reviews[0].rating).toBe(4.5);
    expect(reviews[0].comment).toContain('面条筋道');
    expect(router.currentRoute.value.name).toBe('dishDetail');
  });

  it('allows choosing canteen, stall and dish manually before reviewing', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/reviews/new', name: 'reviewCreate', component: ReviewCreateView },
        {
          path: '/canteens/:canteenId/dishes/:dishId',
          name: 'dishDetail',
          component: { template: '<div />' },
        },
        { path: '/', name: 'homeCanteenSelect', component: { template: '<div />' } },
      ],
    });
    const pinia = createPinia();
    await router.push({ name: 'reviewCreate' });
    await router.isReady();

    const wrapper = mount(ReviewCreateView, {
      global: {
        plugins: [pinia, router],
      },
    });

    const selects = wrapper.findAll('select');
    await selects[0].setValue('xueyi');
    await selects[1].setValue('西北面食');
    await selects[2].setValue('xueyi-northwest-noodles-1');
    await wrapper.find('[aria-label="4 星"]').trigger('click');
    await wrapper.find('textarea').setValue('手动选择后提交的评论。');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    const dishStore = useDishStore();
    const reviews = dishStore.getReviewsByDishId('xueyi-northwest-noodles-1');
    expect(reviews[0].rating).toBe(4);
    expect(reviews[0].comment).toContain('手动选择');
    expect(router.currentRoute.value.name).toBe('dishDetail');
  });
});
