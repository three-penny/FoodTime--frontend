import { defineStore } from 'pinia';
import { fetchAllReviews, auditReview } from '../api/review.api';

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [],
    loading: false,
  }),
  getters: {
    pendingCount(state) {
      return state.reviews.filter(item => item.status === 'pending').length;
    },
    approvedCount(state) {
      return state.reviews.filter(item => item.status === 'approved').length;
    },
    rejectedCount(state) {
      return state.reviews.filter(item => item.status === 'rejected').length;
    },
    statusLabels() {
      return { pending: '待审核', approved: '已通过', rejected: '已驳回' };
    },
  },
  actions: {
    async loadAllReviews() {
      this.loading = true;
      try {
        const res = await fetchAllReviews();
        this.reviews = (res.data || []).map(r => ({
          ...r,
          reason: r.audit_reason || r.reason || '',
        }));
      } catch (e) {
        console.error('加载评论数据失败:', e);
      } finally {
        this.loading = false;
      }
    },
    async approveReview(reviewId) {
      try {
        await auditReview(reviewId, {
          status: 'approved',
          reason: '评论内容已通过审核，已公开展示。',
        });
        const target = this.reviews.find(item => item.id === reviewId);
        if (target) {
          target.status = 'approved';
          target.reason = '评论内容已通过审核，已公开展示。';
        }
      } catch (e) {
        console.error('评论审核通过失败:', e);
      }
    },
    async rejectReview(reviewId, reason = '评论内容不符合发布规范，请修改后重新提交。') {
      try {
        await auditReview(reviewId, { status: 'rejected', reason });
        const target = this.reviews.find(item => item.id === reviewId);
        if (target) {
          target.status = 'rejected';
          target.reason = reason;
        }
      } catch (e) {
        console.error('评论审核驳回失败:', e);
      }
    },
  },
});
