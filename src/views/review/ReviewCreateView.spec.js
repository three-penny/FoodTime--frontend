import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ReviewCreateView from './ReviewCreateView.vue';
import { useDishStore } from '../../store/useDishStore';
import { useAuthStore } from '../../store/useAuthStore';

// Mock review API 返回成功响应
vi.mock('../../api/review.api', () => ({
  createReview: vi.fn().mockResolvedValue({
    code: 0,
    message: '点评成功。',
    data: {
      id: 'review-mock-001',
      dish_id: 'xueyi-northwest-noodles-1',
      user_id: 'test-user-uuid',
      rating: 4.5,
      comment: 'mock comment',
      created_at: '2026-05-24T12:00:00',
    },
  }),
  fetchReviewsByDish: vi.fn(),
}));

describe('ReviewCreateView', () => {
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    // 确保 authStore 有 session（有 id）
    useAuthStore().login({
      id: 'test-user-uuid',
      account: 'testuser',
      nickname: '测试用户',
      role: 'user',
    });
  });

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
    // 导航在 setTimeout 600ms 后触发
    await new Promise(r => setTimeout(r, 650));
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
    await new Promise(r => setTimeout(r, 650));
    expect(router.currentRoute.value.name).toBe('dishDetail');
  });
});
