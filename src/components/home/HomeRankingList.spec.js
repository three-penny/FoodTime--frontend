import { mount, flushPromises } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it, vi } from 'vitest';
import HomeRankingList from './HomeRankingList.vue';
import { fetchDishes, recommendDish, avoidDish } from '../../api/dish.api';
import { useDishStore } from '../../store/useDishStore';

vi.mock('../../api/dish.api', () => ({
  fetchDishes: vi.fn().mockResolvedValue({ data: [] }),
  recommendDish: vi.fn().mockResolvedValue({}),
  avoidDish: vi.fn().mockResolvedValue({}),
}));

describe('HomeRankingList', () => {
  it('reloads persisted dish vote counts when weekly rankings return zero placeholders', async () => {
    const item = {
      dishId: 'dish-1',
      rank: 1,
      score: 4,
      recommendVotes: 0,
      avoidVotes: 0,
    };
    fetchDishes.mockResolvedValueOnce({
      data: [{ id: 'dish-1', recommendVotes: 3, avoidVotes: 2 }],
    });
    const pinia = createPinia();
    const store = useDishStore(pinia);
    const wrapper = mount(HomeRankingList, {
      props: { rankings: [item] },
      global: { plugins: [pinia] },
    });
    await store.loadDishes();
    await flushPromises();
    expect(wrapper.find('.is-stamp-red').text()).toContain('3');
    expect(wrapper.find('.ranking__votes').text()).toContain('3 人推荐');
    expect(wrapper.find('.is-stamp-blue').text()).toContain('2');
    await wrapper.find('.is-stamp-red').trigger('click');
    await flushPromises();
    expect(wrapper.find('.is-stamp-red').text()).toContain('4');
    wrapper.unmount();

    // 刷新后的新 Pinia 和新组件从菜品 API 恢复票数，不依赖旧 voteMap。
    fetchDishes.mockResolvedValueOnce({
      data: [{ id: 'dish-1', recommendVotes: 4, avoidVotes: 2 }],
    });
    const refreshedPinia = createPinia();
    await useDishStore(refreshedPinia).loadDishes();
    const refreshed = mount(HomeRankingList, {
      props: { rankings: [item] },
      global: { plugins: [refreshedPinia] },
    });
    expect(refreshed.find('.is-stamp-red').text()).toContain('4');
    expect(refreshed.find('.ranking__votes').text()).toContain('4 人推荐');
    expect(refreshed.find('.is-stamp-blue').text()).toContain('2');
    refreshed.unmount();
  });

  it('persists votes using dishId even after the ranking order changes', async () => {
    vi.clearAllMocks();
    const pinia = createPinia();
    const dishStore = useDishStore(pinia);
    dishStore.dishes = [{ id: 'dish-42', recommendVotes: 3, avoidVotes: 2 }];
    const item = {
      dishId: 'dish-42',
      rank: 1,
      score: 4.5,
      recommendVotes: 3,
      avoidVotes: 2,
    };
    const wrapper = mount(HomeRankingList, {
      props: { rankings: [item] },
      global: { plugins: [pinia] },
    });
    await wrapper.find('.is-stamp-red').trigger('click');
    await flushPromises();
    expect(recommendDish).toHaveBeenCalledExactlyOnceWith('dish-42');
    expect(dishStore.dishes[0].recommendVotes).toBe(4);
    expect(wrapper.find('.is-stamp-red').text()).toContain('4');

    await wrapper.setProps({ rankings: [{ ...item, rank: 2 }] });
    await wrapper.find('.is-stamp-red').trigger('click');
    await flushPromises();
    expect(recommendDish).toHaveBeenCalledTimes(1);
    await wrapper.find('.is-stamp-blue').trigger('click');
    await flushPromises();
    expect(avoidDish).toHaveBeenCalledExactlyOnceWith('dish-42');
    expect(dishStore.dishes[0].avoidVotes).toBe(3);
    expect(wrapper.find('.is-stamp-red').text()).toContain('4');
    wrapper.unmount();
  });

  it('keeps vote counts unchanged and displays an API error on failure', async () => {
    recommendDish.mockRejectedValueOnce(new Error('投票失败'));
    const pinia = createPinia();
    const dishStore = useDishStore(pinia);
    dishStore.dishes = [{ id: 'dish-1', recommendVotes: 3 }];
    const wrapper = mount(HomeRankingList, {
      props: {
        rankings: [
          {
            dishId: 'dish-1',
            rank: 1,
            score: 4,
            recommendVotes: 3,
            avoidVotes: 0,
          },
        ],
      },
      global: { plugins: [pinia] },
    });
    await wrapper.find('.is-stamp-red').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('投票失败');
    expect(wrapper.find('.is-stamp-red').text()).toContain('3');
    expect(dishStore.dishes[0].recommendVotes).toBe(3);
    wrapper.unmount();
  });

  it('renders a null ranking score as zero', () => {
    const wrapper = mount(HomeRankingList, {
      props: {
        rankings: [
          { rank: 1, dishId: 'dish-1', dishName: '测试菜', score: null },
        ],
      },
      global: { plugins: [createPinia()] },
    });
    expect(wrapper.find('.zine-rating-stamp').text()).toBe('0.0');
    wrapper.unmount();
  });
});
