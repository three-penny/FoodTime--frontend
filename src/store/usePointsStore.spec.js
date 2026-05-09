import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { usePointsStore } from './usePointsStore';

describe('usePointsStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    setActivePinia(createPinia());
  });

  it('adds points and records history for current user', () => {
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({ account: '2024211001', role: 'user' });

    pointsStore.addPoints(10, '发表菜品点评', 'review');

    expect(pointsStore.currentUserPoints).toBe(10);
    expect(pointsStore.currentUserHistory[0].reason).toBe('发表菜品点评');
    expect(pointsStore.currentUserStats.reviewCount).toBe(1);
    expect(pointsStore.currentUserStats.earnedPoints).toBe(10);
  });

  it('allows daily check-in only once per day', () => {
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({ account: '2024211002', role: 'user' });

    expect(pointsStore.dailyCheckIn()).toBe(true);
    expect(pointsStore.dailyCheckIn()).toBe(false);
    expect(pointsStore.currentUserPoints).toBe(5);
    expect(pointsStore.currentUserStats.checkInDays).toBe(1);
  });

  it('tracks spent points separately from earned points', () => {
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({ account: '2024211003', role: 'user' });

    pointsStore.addPoints(30, '投稿审核通过', 'upload');
    expect(pointsStore.consumePoints(20, '兑换食堂优惠券')).toBe(true);

    expect(pointsStore.currentUserPoints).toBe(10);
    expect(pointsStore.currentUserStats.earnedPoints).toBe(30);
    expect(pointsStore.currentUserStats.spentPoints).toBe(20);
  });
});
