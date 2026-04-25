import { defineStore } from 'pinia';
import { DISHES, HOME_RECOMMENDATION_IDS } from '../mock/dishes.mock';

function applySort(list, sortBy) {
  const cloned = [...list];

  if (sortBy === 'rating') {
    return cloned.sort((a, b) => b.rating - a.rating);
  }
  if (sortBy === 'priceAsc') {
    return cloned.sort((a, b) => a.price - b.price);
  }
  if (sortBy === 'priceDesc') {
    return cloned.sort((a, b) => b.price - a.price);
  }
  if (sortBy === 'sales') {
    return cloned.sort((a, b) => b.monthlySales - a.monthlySales);
  }

  return cloned;
}

/**
 * useDishStore
 * 职责：管理菜品数据、筛选排序状态与详情查询能力。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-04-25
 * 使用场景：首页推荐、菜品列表页、菜品详情页。
 * 依赖：Pinia、dishes.mock.js
 */
export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: DISHES,
    filters: {
      keyword: '',
      sortBy: 'default',
      tag: 'all',
    },
  }),
  getters: {
    homeRecommendations(state) {
      return HOME_RECOMMENDATION_IDS.map(id =>
        state.dishes.find(dish => dish.id === id)
      ).filter(Boolean);
    },
    getDishById: state => dishId =>
      state.dishes.find(dish => dish.id === dishId) ?? null,
    getTagsByCanteen: state => canteenId => {
      const tags = state.dishes
        .filter(dish => dish.canteenId === canteenId)
        .flatMap(dish => dish.tags);

      return ['all', ...new Set(tags)];
    },
    getFilteredDishesByCanteen: state => canteenId => {
      const keyword = state.filters.keyword.trim().toLowerCase();
      const list = state.dishes.filter(dish => dish.canteenId === canteenId);

      const filtered = list.filter(dish => {
        const keywordMatched =
          !keyword ||
          dish.name.toLowerCase().includes(keyword) ||
          dish.description.toLowerCase().includes(keyword);
        const tagMatched =
          state.filters.tag === 'all' || dish.tags.includes(state.filters.tag);

        return keywordMatched && tagMatched;
      });

      return applySort(filtered, state.filters.sortBy);
    },
  },
  actions: {
    /**
     * 设置菜品筛选条件。
     * @param {Object} payload 筛选参数
     * @param {string=} payload.keyword 搜索关键字
     * @param {string=} payload.sortBy 排序规则
     * @param {string=} payload.tag 标签筛选
     * @returns {void}
     */
    setDishFilter(payload) {
      this.filters = {
        ...this.filters,
        ...payload,
      };
    },
    /**
     * 重置筛选条件。
     * @returns {void}
     */
    resetDishFilter() {
      this.filters = {
        keyword: '',
        sortBy: 'default',
        tag: 'all',
      };
    },
  },
});
