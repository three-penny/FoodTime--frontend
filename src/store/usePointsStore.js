import { defineStore } from 'pinia';
import { useAuthStore } from './useAuthStore';
import { fetchPoints, fetchPointsHistory, dailyCheckin, consumePoints } from '../api/points.api';

export const usePointsStore = defineStore('points', {
  state: () => ({
    userPoints: {},
    pointsHistory: {},
    loading: false,
  }),
  getters: {
    currentUserPoints(state) {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      const userId = authStore.session?.id;
      if (!account) return 0;
      return state.userPoints[account]?.currentPoints ?? 0;
    },
    currentUserHistory(state) {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return [];
      return state.pointsHistory[account] || [];
    },
    currentUserStats() {
      const history = this.currentUserHistory;
      return {
        checkInDays: history.filter(item => item.type === 'daily').length,
        reviewCount: history.filter(item => item.type === 'review').length,
        uploadCount: history.filter(item => item.type === 'upload').length,
        earnedPoints: history.reduce((sum, item) => {
          const num = parseInt(item.amount);
          return sum + (num > 0 ? num : 0);
        }, 0),
        spentPoints: history.reduce((sum, item) => {
          const num = parseInt(item.amount);
          return sum + (num < 0 ? Math.abs(num) : 0);
        }, 0),
      };
    },
    currentUserLevel() {
      const points = this.currentUserPoints;
      if (points >= 1000) return { name: '美食达人', icon: '🏆' };
      if (points >= 500) return { name: '资深食客', icon: '⭐' };
      if (points >= 200) return { name: '干饭人', icon: '🍚' };
      return { name: '新手', icon: '🌱' };
    },
  },
  actions: {
    async loadUserPoints() {
      const authStore = useAuthStore();
      const userId = authStore.session?.id;
      const account = authStore.session?.account;
      if (!userId || !account) return;

      this.loading = true;
      try {
        const pointsRes = await fetchPoints(userId);
        const historyRes = await fetchPointsHistory(userId);
        this.userPoints[account] = pointsRes.data;
        this.pointsHistory[account] = historyRes.data || [];
      } catch (e) {
        console.error('加载积分数据失败:', e);
      } finally {
        this.loading = false;
      }
    },
    initUserPoints(account) {
      if (!this.userPoints[account]) {
        this.userPoints[account] = { currentPoints: 0, totalEarned: 0, totalUsed: 0 };
        this.pointsHistory[account] = [];
      }
    },
    addPoints(amount, reason, type = 'other') {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return;
      this.initUserPoints(account);
      this.userPoints[account].currentPoints += amount;
      this.pointsHistory[account].unshift({
        id: `points-${Date.now()}`,
        amount: `+${amount}`,
        reason,
        type,
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      });
    },
    async consumePoints(amount, reason) {
      const authStore = useAuthStore();
      const userId = authStore.session?.id;
      const account = authStore.session?.account;
      if (!userId || !account) return false;
      try {
        const res = await consumePoints(userId, amount, reason);
        this.initUserPoints(account);
        this.userPoints[account].currentPoints = res.data?.currentPoints ?? 0;
        this.pointsHistory[account].unshift({
          id: `points-${Date.now()}`,
          amount: `-${amount}`,
          reason,
          type: 'consume',
          timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
        });
        return true;
      } catch (e) {
        if (e.message.includes('积分不足')) return false;
        console.error('积分消费失败:', e);
        return false;
      }
    },
    async dailyCheckIn() {
      const authStore = useAuthStore();
      const userId = authStore.session?.id;
      const account = authStore.session?.account;
      if (!userId || !account) return false;

      try {
        this.initUserPoints(account);
        const res = await dailyCheckin(userId);
        if (res.data?.checkedIn) {
          this.userPoints[account].currentPoints = (this.userPoints[account].currentPoints || 0) + 5;
          this.pointsHistory[account].unshift({
            id: `points-${Date.now()}`,
            amount: '+5',
            reason: '每日签到奖励',
            type: 'daily',
            timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
          });
          return true;
        }
        return false;
      } catch (e) {
        console.error('签到失败:', e);
        return false;
      }
    },
  },
});
