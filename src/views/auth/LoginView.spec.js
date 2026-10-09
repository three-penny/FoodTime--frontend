import { flushPromises, mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { describe, expect, it, vi } from 'vitest';
import LoginView from './LoginView.vue';

vi.mock('../../api/auth.api', () => ({
  login: vi
    .fn()
    .mockResolvedValue({
      data: { id: 'user-1', account: 'student', role: 'user', token: 'token' },
    }),
}));

describe('LoginView', () => {
  it.each([
    ['/dishes/upload?from=login', '/dishes/upload?from=login'],
    [undefined, '/'],
    ['', '/'],
    [['/dishes/upload', '/profile'], '/'],
    ['https://example.com', '/'],
    ['//example.com', '/'],
    ['/\\example.com', '/'],
  ])(
    'redirects after login for query value %j',
    async (redirect, expectedPath) => {
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [
          { path: '/login', component: LoginView },
          {
            path: '/',
            name: 'homeCanteenSelect',
            component: { template: '<main />' },
          },
          { path: '/dishes/upload', component: { template: '<main />' } },
        ],
      });
      await router.push({ path: '/login', query: { redirect } });
      const wrapper = mount(LoginView, {
        global: { plugins: [createPinia(), router] },
      });
      await wrapper.find('input[type="text"]').setValue('student');
      await wrapper.find('input[type="password"]').setValue('password');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(router.currentRoute.value.fullPath).toBe(expectedPath);
      wrapper.unmount();
    },
  );
});
