// @author XXXXX

import { defineStore } from 'pinia';
import { DISH_SUBMISSIONS } from '../mock/submissions.mock';

const STATUS_LABELS = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
};

/**
 * useSubmissionStore
 * 职责：管理用户菜品投稿、审核状态流转和列表筛选所需的共享状态。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：用户上传菜品页、用户投稿页、菜品审核列表页。
 * 依赖：Pinia、submissions.mock.js
 * 设计说明：当前阶段使用 mock 数据模拟 B/S 架构中的后端返回，后续可替换为 API 层。
 */
export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: [...DISH_SUBMISSIONS],
    activeStatus: 'all',
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
        item => item.status === state.activeStatus
      );
    },
    pendingCount(state) {
      return state.submissions.filter(item => item.status === 'pending').length;
    },
    approvedCount(state) {
      return state.submissions.filter(item => item.status === 'approved')
        .length;
    },
    rejectedCount(state) {
      return state.submissions.filter(item => item.status === 'rejected')
        .length;
    },
  },
  actions: {
    /**
     * 新增一条菜品投稿。
     * @param {Object} payload 投稿表单数据。
     * @param {string} payload.dishName 菜品名称。
     * @param {string} payload.canteenName 所在食堂名称。
     * @param {string} payload.stallName 档口名称。
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
      const target = this.submissions.find(item => item.id === submissionId);
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
      const target = this.submissions.find(item => item.id === submissionId);
      if (target) {
        target.status = 'rejected';
        target.reason = reason;
      }
    },
  },
});
