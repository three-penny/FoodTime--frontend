// @author XXXXX

import { defineStore } from 'pinia';
import { fetchMySubmissions } from '../api/submission.api';

const STATUS_LABELS = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
};

/**
 * 将后端返回的提报数据转换为前端展示格式。
 * @param {Object} item 后端提报记录
 * @returns {Object} 前端格式的提报记录
 */
function mapSubmission(item) {
  return {
    id: item.id,
    dishName: item.dish_name,
    canteenName: item.canteen_name,
    stallName: item.stall_name,
    price: item.price,
    submitter: item.submitter_account,
    submittedAt: item.created_at
      ? new Date(item.created_at).toLocaleString('zh-CN', { hour12: false })
      : '',
    status: item.status,
    imageName: item.image_url || '待补充图片',
    reason: item.audit_reason || '',
    description: item.description || '',
    tags: item.tags || [],
  };
}

/**
 * useSubmissionStore
 * 职责：管理用户菜品投稿列表、审核状态流转和统计信息。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：用户上传菜品页、用户投稿页、菜品审核列表页。
 * 依赖：Pinia、submission.api.js
 * 设计说明：对接后端 API 获取真实数据，上传成功后本地即时追加。
 */
export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: [],
    activeStatus: 'all',
    loading: false,
    error: '',
  }),
  getters: {
    statusLabels() {
      return STATUS_LABELS;
    },
    statusOptions() {
      return [
        { value: 'all', label: '全部' },
        ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      ];
    },
    filteredSubmissions(state) {
      if (state.activeStatus === 'all') {
        return state.submissions;
      }
      return state.submissions.filter(
        (item) => item.status === state.activeStatus
      );
    },
    pendingCount(state) {
      return state.submissions.filter((item) => item.status === 'pending').length;
    },
    approvedCount(state) {
      return state.submissions.filter((item) => item.status === 'approved').length;
    },
    rejectedCount(state) {
      return state.submissions.filter((item) => item.status === 'rejected').length;
    },
  },
  actions: {
    /**
     * 从后端加载当前用户的提报列表。
     * @param {string} account 用户账号
     * @returns {Promise<void>}
     */
    async loadSubmissions(account) {
      if (!account) return;
      this.loading = true;
      this.error = '';
      try {
        const res = await fetchMySubmissions(account);
        this.submissions = (res.data.items || []).map(mapSubmission);
      } catch (e) {
        this.error = e.message || '加载投稿列表失败';
        this.submissions = [];
      } finally {
        this.loading = false;
      }
    },
    /**
     * 用后端返回的数据直接追加一条投稿到列表头部（上传成功后即时展示）。
     * @param {Object} item 后端返回的提报记录
     * @returns {void}
     */
    appendSubmission(item) {
      this.submissions.unshift(mapSubmission(item));
    },
    /**
     * 新增一条菜品投稿（本地即时追加，用于上传成功后无需重新加载）。
     * @param {Object} payload 投稿表单数据。
     * @returns {Object} 返回创建后的投稿记录。
     */
    createSubmission(payload) {
      const nextSubmission = {
        id: `submission-${Date.now()}`,
        dishName: payload.dishName,
        canteenName: payload.canteenName,
        stallName: payload.stallName,
        price: Number(payload.price),
        submitter: payload.submitter || '当前用户',
        submittedAt: new Date().toLocaleString('zh-CN', {
          hour12: false,
        }),
        status: 'pending',
        imageName: payload.imageName || '待补充图片',
        reason: '',
        description: payload.description,
        tags: payload.tags,
      };

      this.submissions.unshift(nextSubmission);
      return nextSubmission;
    },
    /**
     * 设置投稿列表筛选状态。
     * @param {string} status 审核状态，支持 all、pending、approved、rejected。
     * @returns {void}
     */
    setActiveStatus(status) {
      if (status === 'all' || Object.hasOwn(STATUS_LABELS, status)) {
        this.activeStatus = status;
      }
    },
    /**
     * 通过某条投稿。
     * @param {string} submissionId 投稿 ID。
     * @returns {void}
     */
    approveSubmission(submissionId) {
      const target = this.submissions.find((item) => item.id === submissionId);
      if (target) {
        target.status = 'approved';
        target.reason = '审核通过，已进入菜品展示候选池。';
      }
    },
    /**
     * 驳回某条投稿。
     * @param {string} submissionId 投稿 ID。
     * @param {string} reason 驳回原因。
     * @returns {void}
     */
    rejectSubmission(submissionId, reason = '信息不完整，请补充后重新提交。') {
      const target = this.submissions.find((item) => item.id === submissionId);
      if (target) {
        target.status = 'rejected';
        target.reason = reason;
      }
    },
  },
});
