// @author XXXXX

import { defineStore } from 'pinia';
import { useAuthStore } from './useAuthStore';

const STORAGE_KEY = 'foodtime_points_state';

function loadPointsState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          userPoints: {},
          pointsHistory: {},
        };
  } catch {
    return {
      userPoints: {},
      pointsHistory: {},
    };
  }
}

function persistPointsState(state) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      userPoints: state.userPoints,
      pointsHistory: state.pointsHistory,
    })
  );
}

/**
 * usePointsStore
 * 职责：管理用户积分系统，包括积分获取、消费和历史记录。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：用户个人中心、积分明细页、各类积分奖励场景。
 * 依赖：Pinia、useAuthStore
 * 设计说明：当前阶段使用前端本地存储模拟积分系统，后续应替换为后端 API。
 */
export const usePointsStore = defineStore('points', {
  state: () => loadPointsState(),
  getters: {
    /**
     * 获取当前用户的积分
     */
    currentUserPoints(state) {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return 0;
      return state.userPoints[account] || 0;
    },
    /**
     * 获取当前用户的积分历史
     */
    currentUserHistory(state) {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return [];
      return state.pointsHistory[account] || [];
    },
    currentUserStats() {
      const history = this.currentUserHistory;
      const earnedRecords = history.filter(item => item.amount.startsWith('+'));
      const spentRecords = history.filter(item => item.amount.startsWith('-'));

      return {
        checkInDays: history.filter(item => item.type === 'daily').length,
        reviewCount: history.filter(item => item.type === 'review').length,
        uploadCount: history.filter(item => item.type === 'upload').length,
        earnedPoints: earnedRecords.reduce(
          (sum, item) => sum + Math.abs(Number(item.amount)),
          0
        ),
        spentPoints: spentRecords.reduce(
          (sum, item) => sum + Math.abs(Number(item.amount)),
          0
        ),
      };
    },
    /**
     * 获取积分等级
     */
    currentUserLevel() {
      const points = this.currentUserPoints;
      if (points >= 1000) return { name: '美食达人', icon: '🏆' };
      if (points >= 500) return { name: '资深食客', icon: '⭐' };
      if (points >= 200) return { name: '干饭人', icon: '🍚' };
      return { name: '新手', icon: '🌱' };
    },
  },
  actions: {
    /**
     * 初始化用户积分（如果不存在）
     * @param {string} account 用户账号
     */
    initUserPoints(account) {
      if (!Object.hasOwn(this.userPoints, account)) {
        this.userPoints[account] = 0;
        this.pointsHistory[account] = [];
        persistPointsState(this);
      }
    },
    /**
     * 增加积分
     * @param {number} amount 积分数量
     * @param {string} reason 获得原因
     * @param {string} type 类型：review(评论)、upload(上传)、daily(签到)等
     */
    addPoints(amount, reason, type = 'other') {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return;

      this.initUserPoints(account);
      this.userPoints[account] += amount;

      // 添加历史记录
      this.pointsHistory[account].unshift({
        id: `points-${Date.now()}`,
        amount: `+${amount}`,
        reason,
        type,
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      });
      persistPointsState(this);
    },
    /**
     * 消费积分
     * @param {number} amount 积分数量
     * @param {string} reason 消费原因
     */
    consumePoints(amount, reason) {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return false;

      this.initUserPoints(account);
      if (this.userPoints[account] < amount) {
        return false; // 积分不足
      }

      this.userPoints[account] -= amount;

      // 添加历史记录
      this.pointsHistory[account].unshift({
        id: `points-${Date.now()}`,
        amount: `-${amount}`,
        reason,
        type: 'consume',
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
      });

      persistPointsState(this);
      return true;
    },
    /**
     * 每日签到奖励
     */
    dailyCheckIn() {
      const authStore = useAuthStore();
      const account = authStore.session?.account;
      if (!account) return false;

      this.initUserPoints(account);

      // 检查今天是否已签到
      const today = new Date().toLocaleDateString('zh-CN');
      const lastCheckIn = this.pointsHistory[account]?.find(
        item => item.type === 'daily'
      );

      if (lastCheckIn) {
        const lastCheckInDate = new Date(
          lastCheckIn.timestamp
        ).toLocaleDateString('zh-CN');
        if (lastCheckInDate === today) {
          return false; // 今天已签到
        }
      }

      this.addPoints(5, '每日签到奖励', 'daily');
      return true;
    },
  },
});
