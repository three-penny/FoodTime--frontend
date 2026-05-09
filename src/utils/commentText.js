// @author XXXXX

/**
 * 格式化评论，显示字数并在超长时截断。
 * @param {string} text 原始评论
 * @param {number} maxLength 最大展示字数
 * @returns {{ text: string, length: number, isTruncated: boolean }} 格式化后的评论信息
 * @throws {Error} 不主动抛错；空值会按空字符串处理
 * @example
 * formatComment('这份饭很稳', 4); // { text: '这份饭很...', length: 5, isTruncated: true }
 * @description 纯函数，无副作用，用于避免用户长评论撑破卡片。
 * @performance O(n) 字符串长度计算。
 */
export function formatComment(text, maxLength = 28) {
  const source = String(text ?? '').trim();
  const length = Array.from(source).length;

  if (length <= maxLength) {
    return {
      text: source,
      length,
      isTruncated: false,
    };
  }

  return {
    text: `${Array.from(source).slice(0, maxLength).join('')}...`,
    length,
    isTruncated: true,
  };
}
