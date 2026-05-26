import { defineStore } from 'pinia';
import { fetchCanteens, fetchCanteenById, fetchCanteenSpots, fetchStallsByCanteen, fetchRankings } from '../api/canteen.api';
import { resolveCanteenImage, resolveStallImage, resolveDishImage } from '../utils/imageMapper';

export const useCanteenStore = defineStore('canteen', {
  state: () => ({
    canteens: [],
    homeCanteenSpots: [],
    rankings: [],
    activeCanteenId: '',
    loading: false,
  }),
  getters: {
    activeCanteen(state) {
      return state.canteens.find(c => c.id === state.activeCanteenId) || null;
    },
  },
  actions: {
    async loadCanteens() {
      this.loading = true;
      try {
        const res = await fetchCanteens();
        this.canteens = (res.data || []).map(c => ({
          ...c,
          image: resolveCanteenImage(c.imageUrl),
        }));
        if (this.canteens.length > 0 && !this.activeCanteenId) {
          this.activeCanteenId = this.canteens[0].id;
        }
      } catch (e) {
        console.error('加载食堂数据失败:', e);
      } finally {
        this.loading = false;
      }
    },
    async loadCanteenSpots() {
      try {
        const res = await fetchCanteenSpots();
        this.homeCanteenSpots = (res.data || []).map(s => ({
          ...s,
          image: resolveCanteenImage(s.imageUrl),
        }));
      } catch (e) {
        console.error('加载食堂推荐失败:', e);
      }
    },
    async loadRankings() {
      try {
        const res = await fetchRankings();
        this.rankings = res.data || [];
      } catch (e) {
        console.error('加载排行榜失败:', e);
      }
    },
    setActiveCanteen(canteenId) {
      this.activeCanteenId = canteenId;
    },
    getCanteenById(canteenId) {
      return this.canteens.find(c => c.id === canteenId) ?? null;
    },
    async loadCanteenDetail(canteenId) {
      try {
        const res = await fetchCanteenById(canteenId);
        if (res.data) {
          const existing = this.canteens.findIndex(c => c.id === canteenId);
          const enriched = { ...res.data, image: resolveCanteenImage(res.data.imageUrl) };
          if (existing >= 0) {
            this.canteens[existing] = enriched;
          } else {
            this.canteens.push(enriched);
          }
        }
      } catch (e) {
        console.error('加载食堂详情失败:', e);
      }
    },
    async loadStallsByCanteen(canteenId) {
      try {
        const res = await fetchStallsByCanteen(canteenId);
        return (res.data || []).map(stall => ({
          ...stall,
          image: resolveStallImage(stall.imageUrl),
          dishes: (stall.dishes || []).map(d => ({
            ...d,
            image: resolveDishImage(d.imageUrl || d.imageUrl),
          })),
        }));
      } catch (e) {
        console.error('加载档口数据失败:', e);
        return [];
      }
    },
  },
});
