import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StarRatingInput from './StarRatingInput.vue';

describe('StarRatingInput', () => {
  it('emits half-star and full-star values from the five-star control', async () => {
    const wrapper = mount(StarRatingInput, {
      props: {
        modelValue: 0,
      },
    });

    await wrapper.find('[aria-label="3.5 星"]').trigger('click');
    await wrapper.find('[aria-label="4 星"]').trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[3.5], [4]]);
  });
});
