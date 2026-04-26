import { defineStore } from 'pinia';
import { DISHES, HOME_RECOMMENDATION_IDS } from '../mock/dishes.mock';

function applySort(list, sortBy) {
  const cloned = [...list];

  if (sortBy === 'rating') {
    return cloned.sort((a, b) => b.rating - a.rating);
  }
  if (sortBy === 'priceAsc') {
    return cloned.sort(
      (a, b) =>
        Number(a.price ?? Number.MAX_SAFE_INTEGER) -
        Number(b.price ?? Number.MAX_SAFE_INTEGER)
    );
  }
  if (sortBy === 'priceDesc') {
    return cloned.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
  }
  if (sortBy === 'sales') {
    return cloned.sort(
      (a, b) => Number(b.monthlySales ?? 0) - Number(a.monthlySales ?? 0)
    );
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
        .flatMap(dish => (Array.isArray(dish.tags) ? dish.tags : []));

      return ['all', ...new Set(tags)];
    },
    getFilteredDishesByCanteen: state => canteenId => {
      const keyword = state.filters.keyword.trim().toLowerCase();
      const list = state.dishes.filter(dish => dish.canteenId === canteenId);

      const filtered = list.filter(dish => {
        const keywordMatched =
          !keyword ||
          dish.name.toLowerCase().includes(keyword) ||
          String(dish.description ?? dish.comment ?? dish.stall ?? '')
            .toLowerCase()
            .includes(keyword);
        const tagMatched =
          state.filters.tag === 'all' ||
          (Array.isArray(dish.tags) && dish.tags.includes(state.filters.tag));

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
