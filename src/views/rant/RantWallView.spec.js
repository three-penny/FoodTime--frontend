import { createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RantWallView from './RantWallView.vue';
import { useRantStore } from '../../store/useRantStore';

describe('RantWallView', () => {
  it('renders today rants and supports submitting a new rant', async () => {
    const pinia = createPinia();
    const wrapper = mount(RantWallView, {
      global: {
        plugins: [pinia],
      },
    });

    const selects = wrapper.findAll('select');
    await selects[0].setValue('xueyi');
    await selects[1].setValue('环境');
    await wrapper.find('textarea').setValue('今天座位区收拾得很快。');
    await wrapper.find('form').trigger('submit.prevent');

    const rantStore = useRantStore();
    expect(rantStore.rants[0].tag).toBe('环境');
    expect(rantStore.rants[0].status).toBe('pending');
    expect(wrapper.text()).toContain('已提交审核');
    expect(wrapper.text()).not.toContain('今天座位区收拾得很快。');
  });
});
