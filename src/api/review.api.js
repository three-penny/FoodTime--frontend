/**
 * review.api
 * 职责：封装菜品点评相关 HTTP 请求（创建评价、按菜品查询评价）。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-05-24
 * 依赖：http.js
 */
import http from './http';

/**
 * 创建菜品评价。
 * @param {Object} data 评价数据 { dish_id, user_id, rating, comment }
 * @returns {Promise<Object>} 返回创建成功的评价记录
 */
export function createReview(data) {
  return http.post('/reviews', data);
}

/**
 * 查询指定菜品的评价列表。
 * @param {string} dishId 菜品 ID
 * @returns {Promise<Object>} 返回包含 items 的评价列表结构
 */
export function fetchReviewsByDish(dishId) {
  return http.get('/reviews', { params: { dish_id: dishId } });
}
