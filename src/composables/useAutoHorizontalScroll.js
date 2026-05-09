// @author XXXXX

import { onMounted, onUnmounted, unref } from 'vue';

/**
 * Auto-scroll a horizontal overflow track while preserving manual drag behavior.
 * @param {import('vue').Ref<HTMLElement|null>} targetRef
 * @param {Object} options
 * @param {number=} options.speed Pixels per second.
 * @param {import('vue').Ref<boolean>|boolean=} options.pauseWhen External pause flag.
 * @param {import('vue').Ref<number>|number=} options.loopItemCount Original item count when the DOM renders a duplicated loop.
 * @param {boolean=} options.pauseOnHover Pause when pointer is over the track.
 * @param {number=} options.hoverPauseDelayMs Delay before hover pause starts.
 * @returns {{ pause: () => void, resume: () => void }}
 */
export function useAutoHorizontalScroll(targetRef, options = {}) {
  const speed = Number(options.speed ?? 18);
  const pauseOnHover = options.pauseOnHover ?? true;
  const hoverPauseDelayMs = Number(options.hoverPauseDelayMs ?? 0);
  let frameId = 0;
  let lastTime = 0;
  let hoverPauseTimerId = 0;
  let isPausedByApi = false;
  let isPausedByHover = false;
  let isFocusInside = false;
  let reducedMotionQuery = null;

  function shouldPause() {
    return (
      isPausedByApi ||
      isPausedByHover ||
      isFocusInside ||
      Boolean(unref(options.pauseWhen)) ||
      Boolean(reducedMotionQuery?.matches)
    );
  }

  function getFrameApi() {
    if (typeof window === 'undefined' || !window.requestAnimationFrame) {
      return null;
    }

    return {
      request: window.requestAnimationFrame.bind(window),
      cancel: window.cancelAnimationFrame.bind(window),
    };
  }

  function getLoopDistance(target) {
    const loopItemCount = Math.max(0, Number(unref(options.loopItemCount) ?? 0));
    const firstLoopItem = target.children[0];
    const secondLoopItem = target.children[loopItemCount];

    if (loopItemCount > 0 && firstLoopItem && secondLoopItem) {
      const loopDistance = secondLoopItem.offsetLeft - firstLoopItem.offsetLeft;
      if (Number.isFinite(loopDistance) && loopDistance > 1) {
        return loopDistance;
      }
    }

    const fallbackDistance = target.scrollWidth - target.clientWidth;
    return Number.isFinite(fallbackDistance) ? Math.max(0, fallbackDistance) : 0;
  }

  function clearHoverPauseTimer() {
    if (hoverPauseTimerId) {
      window.clearTimeout(hoverPauseTimerId);
      hoverPauseTimerId = 0;
    }
  }

  function step(time) {
    const frameApi = getFrameApi();
    if (!frameApi) {
      return;
    }

    frameId = frameApi.request(step);
    const target = targetRef.value;
    if (!target) {
      lastTime = time;
      return;
    }

    const loopDistance = getLoopDistance(target);
    if (loopDistance <= 1 || shouldPause()) {
      lastTime = time;
      return;
    }

    const deltaSeconds = Math.min((time - lastTime) / 1000, 0.08);
    target.scrollLeft += speed * deltaSeconds;

    if (target.scrollLeft >= loopDistance) {
      target.scrollLeft -= loopDistance;
    }

    lastTime = time;
  }

  function pause() {
    isPausedByApi = true;
  }

  function resume() {
    isPausedByApi = false;
  }

  function onPointerEnter() {
    if (!pauseOnHover) {
      return;
    }

    if (hoverPauseDelayMs <= 0) {
      isPausedByHover = true;
      return;
    }

    clearHoverPauseTimer();
    hoverPauseTimerId = window.setTimeout(() => {
      isPausedByHover = true;
      hoverPauseTimerId = 0;
    }, hoverPauseDelayMs);
  }

  function onPointerLeave() {
    clearHoverPauseTimer();
    isPausedByHover = false;
  }

  function onFocusIn() {
    isFocusInside = true;
  }

  function onFocusOut() {
    isFocusInside = false;
  }

  onMounted(() => {
    const target = targetRef.value;
    const frameApi = getFrameApi();
    reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;

    if (target) {
      target.addEventListener('pointerenter', onPointerEnter);
      target.addEventListener('pointerleave', onPointerLeave);
      target.addEventListener('focusin', onFocusIn);
      target.addEventListener('focusout', onFocusOut);
    }

    if (frameApi) {
      frameId = frameApi.request(time => {
        lastTime = time;
        step(time);
      });
    }
  });

  onUnmounted(() => {
    const target = targetRef.value;
    const frameApi = getFrameApi();
    clearHoverPauseTimer();

    if (target) {
      target.removeEventListener('pointerenter', onPointerEnter);
      target.removeEventListener('pointerleave', onPointerLeave);
      target.removeEventListener('focusin', onFocusIn);
      target.removeEventListener('focusout', onFocusOut);
    }

    if (frameApi && frameId) {
      frameApi.cancel(frameId);
    }
  });

  return {
    pause,
    resume,
  };
}
