import { flushPromises, shallowMount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import DishDetailView from './DishDetailView.vue';
import { useAuthStore } from '../../store/useAuthStore';
import { useDishStore } from '../../store/useDishStore';
import { useCanteenStore } from '../../store/useCanteenStore';

async function mountDetail(role = 'user', rating = 4.5) {
  const pinia = createPinia();
  useAuthStore(pinia).login({ account: 'tester', role });
  const dishStore = useDishStore(pinia);
  dishStore.dishes = [
    { id: 'dish-1', canteenId: 'xueyi', name: '测试菜', rating },
  ];
  vi.spyOn(dishStore, 'loadDishDetail').mockResolvedValue();
  vi.spyOn(dishStore, 'loadReviewsByDish').mockResolvedValue();
  const canteenStore = useCanteenStore(pinia);
  canteenStore.canteens = [{ id: 'xueyi', name: '学一餐厅' }];
  vi.spyOn(canteenStore, 'loadCanteenDetail').mockResolvedValue();
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/canteens/:canteenId/dishes/:dishId',
        component: DishDetailView,
      },
    ],
  });
  await router.push('/canteens/xueyi/dishes/dish-1');
  const wrapper = shallowMount(DishDetailView, {
    global: { plugins: [pinia, router] },
  });
  await flushPromises();
  return wrapper;
}

describe('DishDetailView', () => {
  it.each(['admin', 'superadmin'])(
    'shows dish management for %s',
    async (role) => {
      const wrapper = await mountDetail(role);
      expect(wrapper.find('.button-ink--danger').text()).toBe('删除菜品');
      wrapper.unmount();
    },
  );

  it('renders a null rating as zero without crashing', async () => {
    const wrapper = await mountDetail('user', null);
    expect(wrapper.find('.dish-main__meta').text()).toContain('评分 0.0');
    expect(wrapper.find('.button-ink--danger').exists()).toBe(false);
    wrapper.unmount();
  });
});
