import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, expect, it } from 'vitest';
import ProfileView from './ProfileView.vue';
import { useAuthStore } from '../../store/useAuthStore';
import { usePointsStore } from '../../store/usePointsStore';

describe('ProfileView', () => {
  it('renders current user points and handles check-in', async () => {
    window.localStorage.clear();
    const pinia = createPinia();
    const wrapper = mount(ProfileView, {
      global: {
        plugins: [pinia],
      },
    });
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({
      account: '2024211001',
      role: 'user',
      nickname: '测试同学',
    });
    pointsStore.addPoints(10, '发表菜品点评', 'review');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('测试同学');
    expect(wrapper.text()).toContain('10');

    await wrapper.find('button').trigger('click');

    expect(pointsStore.currentUserPoints).toBe(15);
    expect(wrapper.text()).toContain('今日已签到');
  });
});
