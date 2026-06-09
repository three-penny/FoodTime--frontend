import { defineStore } from 'pinia';
import { fetchDishes, fetchDishById, fetchDishReviews, recommendDish, avoidDish } from '../api/dish.api';
import { createReview } from '../api/review.api';
import { fetchCanteenDishes } from '../api/canteen.api';
import { resolveDishImage } from '../utils/imageMapper';

function applySort(list, sortBy) {
  const cloned = [...list];
  if (sortBy === 'rating') {
    return cloned.sort((a, b) => b.rating - a.rating);
  }
  if (sortBy === 'priceAsc') {
    return cloned.sort((a, b) => Number(a.price ?? Number.MAX_SAFE_INTEGER) - Number(b.price ?? Number.MAX_SAFE_INTEGER));
  }
  if (sortBy === 'priceDesc') {
    return cloned.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
  }
  if (sortBy === 'sales') {
    return cloned.sort((a, b) => Number(b.recommendVotes ?? 0) - Number(a.recommendVotes ?? 0));
  }
  return cloned;
}

export const useDishStore = defineStore('dish', {
  state: () => ({
    dishes: [],
    reviewsByDishId: {},
    filters: {
      keyword: '',
      sortBy: 'default',
      tag: 'all',
    },
    loading: false,
  }),
  getters: {
    homeRecommendations(state) {
      return state.dishes.filter(d => d.rating >= 4.7).slice(0, 6);
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
          String(dish.description ?? dish.comment ?? dish.stall ?? '').toLowerCase().includes(keyword);
        const tagMatched =
          state.filters.tag === 'all' ||
          (Array.isArray(dish.tags) && dish.tags.includes(state.filters.tag));
        return keywordMatched && tagMatched;
      });
      return applySort(filtered, state.filters.sortBy);
    },
  },
  actions: {
    async loadDishes() {
      this.loading = true;
      try {
        const res = await fetchDishes(100);
        this.dishes = (res.data || []).map(d => ({
          ...d,
          image: resolveDishImage(d.imageUrl),
        }));
      } catch (e) {
        console.error('加载菜品数据失败:', e);
      } finally {
        this.loading = false;
      }
    },
    async loadDishesByCanteen(canteenId) {
      try {
        const res = await fetchCanteenDishes(canteenId);
        const canteenDishes = (res.data || []).map(d => ({
          ...d,
          image: resolveDishImage(d.imageUrl),
        }));
        canteenDishes.forEach(d => {
          const idx = this.dishes.findIndex(ex => ex.id === d.id);
          if (idx >= 0) this.dishes[idx] = d;
          else this.dishes.push(d);
        });
        return canteenDishes;
      } catch (e) {
        console.error('加载食堂菜品失败:', e);
        return [];
      }
    },
    async loadDishDetail(dishId) {
      try {
        const res = await fetchDishById(dishId);
        if (res.data) {
          const enriched = { ...res.data, image: resolveDishImage(res.data.imageUrl) };
          const idx = this.dishes.findIndex(d => d.id === dishId);
          if (idx >= 0) this.dishes[idx] = enriched;
          else this.dishes.push(enriched);
          return enriched;
        }
      } catch (e) {
        console.error('加载菜品详情失败:', e);
      }
      return null;
    },
    async loadReviewsByDish(dishId) {
      try {
        const res = await fetchDishReviews(dishId);
        this.reviewsByDishId = {
          ...this.reviewsByDishId,
          [dishId]: res.data || [],
        };
      } catch (e) {
        console.error('加载评论失败:', e);
      }
    },
    async createDishReview(payload) {
      const safeRating = Math.min(5, Math.max(1, Number(payload.rating) || 1));
      const { useAuthStore } = await import('./useAuthStore');
      const authStore = useAuthStore();
      const userId = authStore.session?.id || '';
      try {
        const res = await createReview({
          dish_id: payload.dishId,
          user_id: userId,
          rating: safeRating,
          comment: payload.comment,
        });
        if (res.data) {
          this.reviewsByDishId = {
            ...this.reviewsByDishId,
            [payload.dishId]: [
              res.data,
              ...(this.reviewsByDishId[payload.dishId] ?? []),
            ],
          };
          return res.data;
        }
      } catch (e) {
        console.error('提交评价失败:', e);
      }
      const nextReview = {
        id: `review-${payload.dishId}-${Date.now()}`,
        dishId: payload.dishId,
        rating: safeRating,
        comment: payload.comment,
        reviewer: payload.reviewer || '匿名同学',
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
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
    async recommendDish(dishId) {
      try {
        await recommendDish(dishId);
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) dish.recommendVotes = (dish.recommendVotes || 0) + 1;
      } catch (e) {
        console.error('推荐失败:', e);
      }
    },
    async avoidDish(dishId) {
      try {
        await avoidDish(dishId);
        const dish = this.dishes.find(d => d.id === dishId);
        if (dish) dish.avoidVotes = (dish.avoidVotes || 0) + 1;
      } catch (e) {
        console.error('操作失败:', e);
      }
    },
    setDishFilter(payload) {
      this.filters = { ...this.filters, ...payload };
    },
    resetDishFilter() {
      this.filters = { keyword: '', sortBy: 'default', tag: 'all' };
    },
  },
});
