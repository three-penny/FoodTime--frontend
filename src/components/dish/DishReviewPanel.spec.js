import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DishReviewPanel from './DishReviewPanel.vue';

describe('DishReviewPanel', () => {
  it('requests navigation to the review page', async () => {
    const wrapper = mount(DishReviewPanel, {
      props: {
        dishName: '红烧牛肉面',
        reviews: [],
      },
    });

    await wrapper.find('button.button-ink').trigger('click');

    expect(wrapper.emitted('review')).toHaveLength(1);
  });

  it('renders existing text reviews on the dish detail page panel', () => {
    const wrapper = mount(DishReviewPanel, {
      props: {
        dishName: '红烧牛肉面',
        reviews: [
          {
            id: 'review-001',
            rating: 5,
            reviewer: '匿名同学',
            createdAt: '2026-05-09 10:20',
            comment: '汤底比较厚。',
          },
        ],
      },
    });

    expect(wrapper.text()).toContain('汤底比较厚。');
    expect(wrapper.text()).toContain('★');
  });
});
