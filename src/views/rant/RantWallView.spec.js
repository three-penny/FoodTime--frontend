import { createPinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import RantWallView from './RantWallView.vue';
import { useRantStore } from '../../store/useRantStore';

vi.mock('../../api/rant.api', () => ({
  fetchRants: vi.fn().mockResolvedValue({ data: [] }),
  createRant: vi.fn().mockResolvedValue({
    data: {
      id: 'rant-mock-001',
      canteenName: '学一餐厅',
      author: 'testuser',
      content: '今天座位区收拾得很快。',
      tag: '环境',
      createdAt: '14:30',
      status: 'pending',
      reason: '',
    },
  }),
  auditRant: vi.fn().mockResolvedValue({}),
}));

vi.mock('../../api/canteen.api', () => ({
  fetchCanteens: vi.fn().mockResolvedValue({
    data: [
      { id: 'xueyi', name: '学一餐厅', shortName: '学一', imageUrl: '食堂1.png', rating: 4.6 },
    ],
  }),
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

describe('RantWallView', () => {
  it('renders today rants and supports submitting a new rant', async () => {
    const pinia = createPinia();
    const wrapper = mount(RantWallView, {
      global: {
        plugins: [pinia],
      },
    });
    await flushPromises();

    const selects = wrapper.findAll('select');
    await selects[0].setValue('xueyi');
    await selects[1].setValue('环境');
    await wrapper.find('textarea').setValue('今天座位区收拾得很快。');
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    const rantStore = useRantStore();
    expect(rantStore.rants[0].tag).toBe('环境');
    expect(rantStore.rants[0].status).toBe('pending');
    expect(wrapper.text()).toContain('已提交审核');
    expect(wrapper.text()).not.toContain('今天座位区收拾得很快。');
  });
});
