import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CanteenStallCard from './CanteenStallCard.vue';

const baseDish = {
  id: 'dish',
  stall: '测试档口',
  image: 'https://example.com/dish.jpg',
  price: 18,
  comment: '测试点评',
};

describe('CanteenStallCard', () => {
  it('shows top three rated dishes first and expands the rest on click', async () => {
    const wrapper = mount(CanteenStallCard, {
      props: {
        stall: {
          id: 'stall-1',
          name: '测试档口',
          image: 'https://example.com/stall.jpg',
          avgPrice: '¥10 - ¥20',
          bestTime: '11:20 前',
          summary: '测试档口说明',
          dishes: [
            { ...baseDish, id: 'low', name: '低分菜', rating: 4.1 },
            { ...baseDish, id: 'top', name: '最高分菜', rating: 4.9 },
            { ...baseDish, id: 'second', name: '第二名菜', rating: 4.8 },
            { ...baseDish, id: 'third', name: '第三名菜', rating: 4.7 },
          ],
        },
      },
    });

    expect(wrapper.text()).toContain('最高分菜');
    expect(wrapper.text()).toContain('第二名菜');
    expect(wrapper.text()).toContain('第三名菜');
    expect(wrapper.text()).not.toContain('低分菜');
    expect(
      wrapper
        .find('.canteen-stall-card__dishes .canteen-stall-card__toggle')
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .find('.canteen-stall-card__info .canteen-stall-card__toggle')
        .exists(),
    ).toBe(false);
    expect(
      wrapper.find('.canteen-stall-card__toggle').attributes('aria-expanded'),
    ).toBe('false');

    await wrapper.find('.canteen-stall-card__toggle').trigger('click');

    expect(wrapper.text()).toContain('低分菜');
    expect(
      wrapper.find('.canteen-stall-card__toggle').attributes('aria-expanded'),
    ).toBe('true');
  });

  it('renders dish items as vertical text rows without dish images', () => {
    const wrapper = mount(CanteenStallCard, {
      props: {
        stall: {
          id: 'stall-2',
          name: '文字档口',
          image: 'https://example.com/stall.jpg',
          avgPrice: '¥10 - ¥20',
          bestTime: '12:40 后',
          summary: '测试档口说明',
          dishes: [
            {
              ...baseDish,
              id: 'dish-1',
              name: '文字菜',
              rating: 4.8,
              price: 16,
              comment: '这是一条比较真实的学生评价，会在页面里按两行限制展示。',
            },
          ],
        },
      },
    });

    expect(wrapper.find('.canteen-stall-card__dish-image').exists()).toBe(
      false,
    );
    expect(wrapper.text()).toContain('文字菜');
    expect(wrapper.text()).toContain('评分 4.8');
    expect(wrapper.text()).toContain('¥16');
    expect(wrapper.text()).toContain('真实评价：');
  });

  it('emits selected dish when a dish row is clicked', async () => {
    const wrapper = mount(CanteenStallCard, {
      props: {
        stall: {
          id: 'stall-3',
          name: '可点档口',
          image: 'https://example.com/stall.jpg',
          avgPrice: '¥10 - ¥20',
          bestTime: '12:40 后',
          summary: '测试档口说明',
          dishes: [
            {
              ...baseDish,
              id: 'dish-clickable',
              name: '可点击菜',
              rating: 4.8,
            },
          ],
        },
      },
    });

    await wrapper.find('.canteen-stall-card__dish').trigger('click');

    expect(wrapper.emitted('dish-click')?.[0][0].id).toBe('dish-clickable');
  });
});
