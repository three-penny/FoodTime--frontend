import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import ProfileView from './ProfileView.vue';
import { useAuthStore } from '../../store/useAuthStore';
import { usePointsStore } from '../../store/usePointsStore';

vi.mock('../../api/points.api', () => ({
  fetchPoints: vi.fn().mockResolvedValue({ data: { currentPoints: 10, totalEarned: 30, totalUsed: 20 } }),
  fetchPointsHistory: vi.fn().mockResolvedValue({ data: [] }),
  dailyCheckin: vi.fn().mockResolvedValue({ data: { checkedIn: false } }),
}));

vi.mock('../../api/canteen.api', () => ({
  fetchCanteens: vi.fn().mockResolvedValue({ data: [] }),
  fetchCanteenById: vi.fn().mockResolvedValue({ data: null }),
  fetchCanteenSpots: vi.fn().mockResolvedValue({ data: [] }),
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

vi.mock('../../api/submission.api', () => ({
  fetchMySubmissions: vi.fn().mockResolvedValue({ data: { items: [] } }),
  createSubmission: vi.fn().mockResolvedValue({ data: {} }),
}));

describe('ProfileView', () => {
  it('renders account info and shows point income and spending ledgers', async () => {
    window.localStorage.clear();
    const pinia = createPinia();
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/',
          name: 'profile',
          component: { template: '<main />' },
        },
        {
          path: '/submissions',
          name: 'userSubmissions',
          component: { template: '<main />' },
        },
        {
          path: '/dishes/upload',
          name: 'dishUpload',
          component: { template: '<main />' },
        },
      ],
    });
    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia, router],
      },
    });
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({
      account: '2024211001',
      role: 'user',
      nickname: '测试同学',
    });
    pointsStore.addPoints(30, '发表菜品点评', 'review');
    pointsStore.consumePoints(20, '兑换食堂优惠券');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('测试同学');
    expect(wrapper.text()).toContain('2024211001');
    expect(wrapper.text()).toContain('普通用户');

    const pointsTab = wrapper
      .findAll('.profile-tabs button')
      .find(button => button.text().includes('积分明细'));
    await pointsTab.trigger('click');

    expect(wrapper.text()).toContain('当前积分');
    expect(wrapper.text()).toContain('获得来源');
    expect(wrapper.text()).toContain('发表菜品点评');
    expect(wrapper.text()).toContain('使用来源');
    expect(wrapper.text()).toContain('兑换食堂优惠券');
  });
});
