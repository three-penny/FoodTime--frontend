import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { usePointsStore } from './usePointsStore';

vi.mock('../api/points.api', () => ({
  fetchPoints: vi.fn().mockResolvedValue({ data: { currentPoints: 0, totalEarned: 0, totalUsed: 0 } }),
  fetchPointsHistory: vi.fn().mockResolvedValue({ data: [] }),
  dailyCheckin: vi.fn().mockResolvedValue({ data: { checkedIn: true } }),
}));

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

  it('allows daily check-in only once per day', async () => {
    const authStore = useAuthStore();
    const pointsStore = usePointsStore();
    authStore.login({ id: 'user-1002', account: '2024211002', role: 'user' });

    expect(await pointsStore.dailyCheckIn()).toBe(true);
    // 第二次签到：API 返回 checkedIn: false
    const { dailyCheckin } = await import('../api/points.api');
    dailyCheckin.mockResolvedValue({ data: { checkedIn: false } });
    expect(await pointsStore.dailyCheckIn()).toBe(false);
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
