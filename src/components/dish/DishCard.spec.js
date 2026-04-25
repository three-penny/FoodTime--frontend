import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import { describe, expect, it } from 'vitest';
import DishCard from './DishCard.vue';

describe('DishCard', () => {
  it('renders core dish info', () => {
    const wrapper = mount(DishCard, {
      props: {
        dish: {
          id: 'dish-1',
          name: '红烧牛肉面',
          description: '测试描述',
          canteenName: '学苑餐厅',
          price: 22,
          rating: 4.9,
          monthlySales: 320,
          tags: ['招牌', '热汤'],
          image: 'https://example.com/image.jpg',
        },
      },
      global: {
        plugins: [ElementPlus],
      },
    });

    expect(wrapper.text()).toContain('红烧牛肉面');
    expect(wrapper.text()).toContain('¥22');
    expect(wrapper.text()).toContain('评分 4.9');
    expect(wrapper.text()).toContain('月售 320');
    expect(wrapper.text()).toContain('招牌');
  });

  it('renders fallback tag when tags are empty', () => {
    const wrapper = mount(DishCard, {
      props: {
        dish: {
          id: 'dish-2',
          name: '香菇滑鸡饭',
          description: '测试描述',
          canteenName: '教工餐厅',
          price: 18,
          rating: 4.6,
          monthlySales: 200,
          tags: [],
          image: 'https://example.com/image.jpg',
        },
      },
      global: {
        plugins: [ElementPlus],
      },
    });

    expect(wrapper.text()).toContain('待补充标签');
  });
});
