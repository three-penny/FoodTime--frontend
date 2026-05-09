import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it } from 'vitest';
import ProfileView from './ProfileView.vue';
import { useAuthStore } from '../../store/useAuthStore';
import { usePointsStore } from '../../store/usePointsStore';

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
