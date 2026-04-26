import { defineStore } from 'pinia';
import {
  CANTEENS,
  HOME_CANTEEN_SPOTS,
  HOME_RANKINGS,
} from '../mock/canteens.mock';

/**
 * useCanteenStore
 * 职责：维护食堂基础信息、首页排行榜与当前选中食堂状态。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-04-25
 * 使用场景：首页、食堂详情页、菜品列表页。
 * 依赖：Pinia、canteens.mock.js
 */
export const useCanteenStore = defineStore('canteen', {
  state: () => ({
    canteens: CANTEENS,
    homeCanteenSpots: HOME_CANTEEN_SPOTS,
    rankings: HOME_RANKINGS,
    activeCanteenId: CANTEENS[0]?.id ?? '',
  }),
  getters: {
    activeCanteen(state) {
      return state.canteens.find(
        canteen => canteen.id === state.activeCanteenId
      );
    },
  },
  actions: {
    /**
     * 设置当前活跃食堂。
     * @param {string} canteenId 食堂 ID
     * @returns {void}
     */
    setActiveCanteen(canteenId) {
      if (this.canteens.some(canteen => canteen.id === canteenId)) {
        this.activeCanteenId = canteenId;
      }
    },
    /**
     * 根据食堂 ID 获取食堂详情。
     * @param {string} canteenId 食堂 ID
     * @returns {Object|null}
     */
    getCanteenById(canteenId) {
      return this.canteens.find(canteen => canteen.id === canteenId) ?? null;
    },
  },
});
