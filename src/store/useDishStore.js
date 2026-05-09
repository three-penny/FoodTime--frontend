import { defineStore } from 'pinia';
import { DISHES, HOME_RECOMMENDATION_IDS } from '../mock/dishes.mock';
import { CANTEENS } from '../mock/canteens.mock';
import { createDefaultCanteenStalls } from '../mock/stalls.mock';

const STALL_DISHES = CANTEENS.flatMap(canteen =>
  createDefaultCanteenStalls(canteen).flatMap(stall => stall.dishes)
);

const INITIAL_DISH_REVIEWS = {
  'braised-beef-noodle': [
    {
      id: 'review-braised-beef-noodle-001',
      dishId: 'braised-beef-noodle',
      rating: 5,
      comment: '汤底比较厚，牛肉分量稳定，适合午饭正餐。',
      reviewer: '匿名同学',
      createdAt: '2026-05-09 10:20',
    },
  ],
};

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
 * 职责：管理菜品数据、筛选排序状态、详情查询能力与用户点评状态。
 * 作者：XXXXX
 * 创建时间：2026-04-25
 * 使用场景：首页推荐、菜品列表页、菜品详情页、菜品点评表单。
 * 依赖：Pinia、dishes.mock.js
 * 设计说明：当前阶段使用 store 保存前端临时点评，后续接入后端时可替换为 API 数据源。
 */
export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [...DISHES, ...STALL_DISHES],
    reviewsByDishId: { ...INITIAL_DISH_REVIEWS },
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
    getReviewsByDishId: state => dishId => state.reviewsByDishId[dishId] ?? [],
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
     * 新增菜品点评。
     * @param {Object} payload 点评表单数据。
     * @param {string} payload.dishId 菜品 ID。
     * @param {number} payload.rating 用户选择的星级，范围 1 到 5。
     * @param {string} payload.comment 用户文字评论。
     * @param {string=} payload.reviewer 点评人展示名。
     * @returns {Object} 返回创建后的点评记录。
     */
    createDishReview(payload) {
      const safeRating = Math.min(5, Math.max(1, Number(payload.rating) || 1));
      const nextReview = {
        id: `review-${payload.dishId}-${Date.now()}`,
        dishId: payload.dishId,
        rating: safeRating,
        comment: payload.comment,
        reviewer: payload.reviewer || '匿名同学',
        createdAt: new Date().toLocaleString('zh-CN', {
          hour12: false,
        }),
      };

      this.reviewsByDishId = {
        ...this.reviewsByDishId,
        [payload.dishId]: [
          nextReview,
          ...(this.reviewsByDishId[payload.dishId] ?? []),
        ],
      };

      return nextReview;
    },
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
