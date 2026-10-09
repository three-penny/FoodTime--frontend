import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import DishUploadView from './DishUploadView.vue';
import { fetchCanteens } from '../../api/canteen.api';

vi.mock('../../api/canteen.api', () => ({
  fetchCanteens: vi.fn().mockResolvedValue({
    data: [{ id: 'xueyi', name: '学一餐厅', imageUrl: '食堂1.png' }],
  }),
}));

describe('DishUploadView', () => {
  it('loads canteen options when the upload route is opened directly', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/dishes/upload', component: DishUploadView }],
    });
    await router.push('/dishes/upload');
    const wrapper = mount(DishUploadView, {
      global: { plugins: [createPinia(), router] },
    });
    await flushPromises();

    expect(fetchCanteens).toHaveBeenCalledTimes(1);
    expect(wrapper.find('option[value="学一餐厅"]').exists()).toBe(true);
    await wrapper.find('select').setValue('学一餐厅');
    expect(wrapper.find('select').element.value).toBe('学一餐厅');
    wrapper.unmount();
  });
});
