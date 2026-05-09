// @author XXXXX

import { defineStore } from 'pinia';
import { TODAY_RANTS } from '../mock/rants.mock';

/**
 * useRantStore
 * 职责：管理今日吐槽墙内容、首页实时预览和用户新增吐槽。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：首页吐槽墙入口、吐槽墙浏览与发布页面。
 * 依赖：Pinia、rants.mock.js
 * 设计说明：当前阶段使用前端状态模拟实时吐槽流，后续可替换为 WebSocket 或轮询接口。
 */
export const useRantStore = defineStore('rant', {
  state: () => ({
    rants: [...TODAY_RANTS],
  }),
  getters: {
    todayPreview(state) {
      return state.rants.slice(0, 3);
    },
    totalCount(state) {
      return state.rants.length;
    },
  },
  actions: {
    /**
     * 新增一条今日吐槽。
     * @param {Object} payload 吐槽表单数据。
     * @param {string} payload.canteenId 食堂 ID。
     * @param {string} payload.canteenName 食堂名称。
     * @param {string} payload.content 吐槽内容。
     * @param {string=} payload.tag 吐槽标签。
     * @param {string=} payload.author 发布人。
     * @returns {Object} 返回创建后的吐槽记录。
     */
    createRant(payload) {
      const nextRant = {
        id: `rant-${Date.now()}`,
        canteenId: payload.canteenId,
        canteenName: payload.canteenName,
        author: payload.author || '匿名同学',
        content: payload.content,
        tag: payload.tag || '吐槽',
        createdAt: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      };

      this.rants.unshift(nextRant);
      return nextRant;
    },
  },
});
