// @author XXXXX

import { onMounted, onUnmounted, ref } from 'vue';

/**
 * 提供横向滚动容器的鼠标拖拽能力。
 * @param {import('vue').Ref<HTMLElement|null>} targetRef 滚动容器引用
 * @returns {Object} 返回拖拽状态与 pointer 事件处理方法
 * @throws {Error} 不主动抛错；缺少 DOM 引用时会安全忽略
 * @example
 * const trackRef = ref(null);
 * const dragScroll = useDragScroll(trackRef);
 * @description 该方法会读取并写入 DOM scrollLeft，属于局部交互副作用。
 * @performance 仅在 pointermove 时同步滚动，避免额外动画计时器。
 */
export function useDragScroll(targetRef) {
  const DRAG_THRESHOLD = 6;
  const isDragging = ref(false);
  const wasDragged = ref(false);
  let startX = 0;
  let startScrollLeft = 0;
  let activePointerId = null;
  let hasCapturedPointer = false;

  function resetDragState(pointerId = null) {
    const target = targetRef.value;
    if (
      target &&
      hasCapturedPointer &&
      pointerId !== null &&
      target.hasPointerCapture?.(pointerId)
    ) {
      target.releasePointerCapture(pointerId);
    }

    isDragging.value = false;
    activePointerId = null;
    hasCapturedPointer = false;
  }

  function onPointerDown(event) {
    const target = targetRef.value;
    if (!target || event.button > 0) {
      return;
    }

    isDragging.value = true;
    wasDragged.value = false;
    startX = event.clientX;
    startScrollLeft = target.scrollLeft;
    activePointerId = event.pointerId;
    hasCapturedPointer = false;
  }

  function onPointerMove(event) {
    const target = targetRef.value;
    if (!target || !isDragging.value || event.pointerId !== activePointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    if (!wasDragged.value && Math.abs(deltaX) <= DRAG_THRESHOLD) {
      return;
    }

    if (!hasCapturedPointer) {
      target.setPointerCapture?.(event.pointerId);
      hasCapturedPointer = true;
    }

    wasDragged.value = true;
    event.preventDefault();
    target.scrollLeft = startScrollLeft - deltaX;
  }

  function onPointerEnd(event) {
    if (!isDragging.value || event.pointerId !== activePointerId) {
      return;
    }

    resetDragState(event.pointerId);
  }

  function onPointerLeave() {
    if (!isDragging.value) {
      return;
    }

    resetDragState(activePointerId);
  }

  function onLostPointerCapture(event) {
    if (!isDragging.value || event.pointerId !== activePointerId) {
      return;
    }

    resetDragState(event.pointerId);
  }

  function onWindowBlur() {
    if (!isDragging.value) {
      return;
    }

    resetDragState(activePointerId);
  }

  onMounted(() => {
    window.addEventListener('blur', onWindowBlur);
  });

  onUnmounted(() => {
    window.removeEventListener('blur', onWindowBlur);
  });

  return {
    isDragging,
    wasDragged,
    resetDragState,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onPointerLeave,
    onLostPointerCapture,
  };
}
