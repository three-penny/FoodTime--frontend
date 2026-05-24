import { defineStore } from 'pinia';
import { fetchRants, createRant, auditRant } from '../api/rant.api';

export const useRantStore = defineStore('rant', {
  state: () => ({
    rants: [],
    loading: false,
  }),
  getters: {
    todayPreview(state) {
      return state.rants.filter(item => item.status === 'approved').slice(0, 3);
    },
    visibleRants(state) {
      return state.rants.filter(item => item.status === 'approved');
    },
    pendingCount(state) {
      return state.rants.filter(item => item.status === 'pending').length;
    },
    approvedCount(state) {
      return state.rants.filter(item => item.status === 'approved').length;
    },
    rejectedCount(state) {
      return state.rants.filter(item => item.status === 'rejected').length;
    },
    statusLabels() {
      return { pending: '待审核', approved: '已通过', rejected: '已驳回' };
    },
    totalCount(state) {
      return state.rants.length;
    },
  },
  actions: {
    async loadRants() {
      this.loading = true;
      try {
        const res = await fetchRants();
        this.rants = res.data || [];
      } catch (e) {
        console.error('加载吐槽数据失败:', e);
      } finally {
        this.loading = false;
      }
    },
    async createRant(payload) {
      try {
        const res = await createRant({
          canteenName: payload.canteenName || '',
          author: payload.author || '',
          content: payload.content,
          tag: payload.tag || '吐槽',
        });
        const newRant = res.data;
        if (newRant) {
          newRant.canteenId = payload.canteenId || '';
          this.rants.unshift(newRant);
          return newRant;
        }
      } catch (e) {
        console.error('发布吐槽失败:', e);
      }
      const fallback = {
        id: `rant-${Date.now()}`,
        canteenId: payload.canteenId || '',
        canteenName: payload.canteenName || '',
        author: payload.author || '匿名同学',
        content: payload.content,
        tag: payload.tag || '吐槽',
        createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        status: 'pending',
        reason: '',
      };
      this.rants.unshift(fallback);
      return fallback;
    },
    async approveRant(rantId) {
      try {
        await auditRant(rantId, { status: 'approved', reason: '内容已通过审核，已展示到今日吐槽墙。', auditor: 'admin' });
        const target = this.rants.find(item => item.id === rantId);
        if (target) {
          target.status = 'approved';
          target.reason = '内容已通过审核，已展示到今日吐槽墙。';
        }
      } catch (e) {
        console.error('审核通过失败:', e);
      }
    },
    async rejectRant(rantId, reason = '内容不符合发布规范，请调整后重新提交。') {
      try {
        await auditRant(rantId, { status: 'rejected', reason, auditor: 'admin' });
        const target = this.rants.find(item => item.id === rantId);
        if (target) {
          target.status = 'rejected';
          target.reason = reason;
        }
      } catch (e) {
        console.error('审核驳回失败:', e);
      }
    },
  },
});
