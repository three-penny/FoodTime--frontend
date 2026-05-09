// @author XXXXX

import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAutoHorizontalScroll } from './useAutoHorizontalScroll';

function createFrameController() {
  let nextId = 1;
  const callbacks = new Map();

  function request(callback) {
    const id = nextId++;
    callbacks.set(id, callback);
    return id;
  }

  function cancel(id) {
    callbacks.delete(id);
  }

  function runFrame(time) {
    const tasks = [...callbacks.entries()];
    callbacks.clear();
    tasks.forEach(([, callback]) => callback(time));
  }

  return { request, cancel, runFrame };
}

describe('useAutoHorizontalScroll', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountScrollDemo({ options = {}, reduceMotion = false } = {}) {
    const frame = createFrameController();
    vi.stubGlobal('requestAnimationFrame', frame.request);
    vi.stubGlobal('cancelAnimationFrame', frame.cancel);
    vi.stubGlobal('matchMedia', () => ({ matches: reduceMotion }));

    const Demo = defineComponent({
      setup() {
        const trackRef = ref(null);
        useAutoHorizontalScroll(trackRef, {
          speed: 100,
          loopItemCount: 0,
          ...options,
        });
        return { trackRef };
      },
      template: '<div ref="trackRef"></div>',
    });

    const wrapper = mount(Demo);
    const track = wrapper.get('div').element;

    Object.defineProperty(track, 'scrollWidth', {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(track, 'clientWidth', {
      configurable: true,
      value: 120,
    });
    track.scrollLeft = 0;

    return {
      frame,
      wrapper,
      track,
    };
  }

  it('auto-scrolls when not paused', async () => {
    const { frame, track } = mountScrollDemo();

    frame.runFrame(0);
    frame.runFrame(120);

    expect(track.scrollLeft).toBeGreaterThan(0);
  });

  it('pauses on hover and resumes on pointer leave', async () => {
    const { frame, track } = mountScrollDemo();

    frame.runFrame(0);
    frame.runFrame(120);
    const beforeHover = track.scrollLeft;

    track.dispatchEvent(new Event('pointerenter'));
    frame.runFrame(240);
    expect(track.scrollLeft).toBeCloseTo(beforeHover, 6);

    track.dispatchEvent(new Event('pointerleave'));
    frame.runFrame(360);
    expect(track.scrollLeft).toBeGreaterThan(beforeHover);
  });

  it('respects prefers-reduced-motion and keeps track still', async () => {
    const { frame, track } = mountScrollDemo({ reduceMotion: true });

    frame.runFrame(0);
    frame.runFrame(120);

    expect(track.scrollLeft).toBe(0);
  });

  it('does not scroll when loop distance is too small', async () => {
    const { frame, track } = mountScrollDemo();

    Object.defineProperty(track, 'scrollWidth', {
      configurable: true,
      value: 120,
    });
    Object.defineProperty(track, 'clientWidth', {
      configurable: true,
      value: 120,
    });

    frame.runFrame(0);
    frame.runFrame(120);

    expect(track.scrollLeft).toBe(0);
  });
});
