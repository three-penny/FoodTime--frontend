// @author XXXXX

/**
 * 根据评分返回统一的印章标签。
 * @param {number} rating 评分数值
 * @returns {string} 评分对应的标签：必吃、推荐、再议、踩雷
 * @throws {Error} 不主动抛错；非数字会按 0 分处理
 * @example
 * getRatingLabel(4.6); // '必吃'
 * @description 纯函数，无副作用，用于统一全站评分标签口径。
 * @performance O(1) 常量时间。
 */
export function getRatingLabel(rating) {
  const value = Number(rating) || 0;

  if (value >= 4.5) {
    return '必吃';
  }
  if (value >= 4) {
    return '推荐';
  }
  if (value >= 3) {
    return '再议';
  }
  return '踩雷';
}
