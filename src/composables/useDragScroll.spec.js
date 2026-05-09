// @author XXXXX

import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { useDragScroll } from './useDragScroll';

function mountDragDemo() {
  const Demo = defineComponent({
    setup() {
      const trackRef = ref(null);
      const drag = useDragScroll(trackRef);

      return {
        trackRef,
        ...drag,
      };
    },
    template: `
      <div
        ref="trackRef"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerEnd"
        @pointercancel="onPointerEnd"
        @pointerleave="onPointerLeave"
        @lostpointercapture="onLostPointerCapture"
      ></div>
    `,
  });

  const wrapper = mount(Demo);
  const track = wrapper.get('div').element;
  track.scrollLeft = 0;
  track.setPointerCapture = vi.fn();
  track.releasePointerCapture = vi.fn();
  track.hasPointerCapture = vi.fn(() => true);

  return { wrapper, track };
}

describe('useDragScroll', () => {
  it('keeps click behavior when movement is below drag threshold', async () => {
    const { wrapper, track } = mountDragDemo();
    track.scrollLeft = 12;

    await wrapper.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 1 });
    expect(track.setPointerCapture).not.toHaveBeenCalled();
    await wrapper.trigger('pointermove', { clientX: 104, pointerId: 1 });

    expect(wrapper.vm.wasDragged).toBe(false);
    expect(track.scrollLeft).toBe(12);

    await wrapper.trigger('pointerup', { pointerId: 1 });
    expect(wrapper.vm.isDragging).toBe(false);
  });

  it('starts real drag only after threshold and updates scrollLeft', async () => {
    const { wrapper, track } = mountDragDemo();
    track.scrollLeft = 20;

    await wrapper.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 2 });
    expect(track.setPointerCapture).not.toHaveBeenCalled();
    await wrapper.trigger('pointermove', { clientX: 80, pointerId: 2 });

    expect(track.setPointerCapture).toHaveBeenCalledWith(2);
    expect(wrapper.vm.wasDragged).toBe(true);
    expect(track.scrollLeft).toBe(40);

    await wrapper.trigger('pointerup', { pointerId: 2 });
    expect(wrapper.vm.isDragging).toBe(false);
    expect(track.releasePointerCapture).toHaveBeenCalledWith(2);
  });

  it('resets dragging state on pointerleave, lostpointercapture and window blur', async () => {
    const { wrapper } = mountDragDemo();

    await wrapper.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 3 });
    expect(wrapper.vm.isDragging).toBe(true);
    await wrapper.trigger('pointerleave');
    expect(wrapper.vm.isDragging).toBe(false);

    await wrapper.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 4 });
    expect(wrapper.vm.isDragging).toBe(true);
    await wrapper.trigger('lostpointercapture', { pointerId: 4 });
    expect(wrapper.vm.isDragging).toBe(false);

    await wrapper.trigger('pointerdown', { button: 0, clientX: 100, pointerId: 5 });
    expect(wrapper.vm.isDragging).toBe(true);
    window.dispatchEvent(new Event('blur'));
    expect(wrapper.vm.isDragging).toBe(false);
  });
});
