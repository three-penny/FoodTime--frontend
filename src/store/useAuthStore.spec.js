import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { ADMIN_INVITE_CODE, useAuthStore } from './useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('stores user login session and clears it on logout', () => {
    const store = useAuthStore();

    store.login({
      account: '2024211001',
      role: 'user',
      nickname: '食堂观察员',
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.currentRole).toBe('user');
    expect(store.displayName).toBe('食堂观察员');

    store.logout();

    expect(store.isAuthenticated).toBe(false);
  });

  it('validates admin invite code before admin registration', () => {
    const store = useAuthStore();

    expect(store.validateAdminInvite(ADMIN_INVITE_CODE)).toBe(true);
    expect(store.validateAdminInvite('wrong-code')).toBe(false);
  });
});
