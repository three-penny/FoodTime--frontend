import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DishCard from './DishCard.vue';

describe('DishCard', () => {
  it('renders core dish info and value note', () => {
    const wrapper = mount(DishCard, {
      props: {
        dish: {
          id: 'dish-1',
          name: '红烧牛肉面',
          description: '测试描述',
          comment: '今天稳得离谱',
          canteenName: '学苑餐厅',
          price: 22,
          valueNote: '一碗顶一顿',
          rating: 4.9,
          monthlySales: 320,
          tags: ['招牌', '热汤'],
          image: 'https://example.com/image.jpg',
        },
      },
    });

    expect(wrapper.text()).toContain('红烧牛肉面');
    expect(wrapper.text()).toContain('¥22 / 一碗顶一顿');
    expect(wrapper.text()).toContain('评分 4.9');
    expect(wrapper.text()).toContain('月售 320');
    expect(wrapper.text()).toContain('必吃');
    expect(wrapper.text()).toContain('#招牌');
  });

  it('renders fallback tag when tags are empty', () => {
    const wrapper = mount(DishCard, {
      props: {
        dish: {
          id: 'dish-2',
          name: '香菇滑鸡饭',
          description: '测试描述',
          comment: '普通发挥',
          canteenName: '教工餐厅',
          price: 18,
          valueNote: '吃到撑',
          rating: 4.6,
          monthlySales: 200,
          tags: [],
          image: 'https://example.com/image.jpg',
        },
      },
    });

    expect(wrapper.text()).toContain('#必吃');
  });

  it('supports the minimal dish input fields', () => {
    const wrapper = mount(DishCard, {
      props: {
        dish: {
          id: 'dish-3',
          name: '番茄肥牛饭',
          comment: '酸甜稳定，课间冲过去也能很快吃上。',
          canteenName: '教工餐厅',
          stall: '酸甜稳妥',
          rating: 4.8,
          image: 'https://example.com/image.jpg',
        },
      },
    });

    expect(wrapper.text()).toContain('番茄肥牛饭');
    expect(wrapper.text()).toContain('酸甜稳妥');
    expect(wrapper.text()).toContain('评分 4.8');
    expect(wrapper.text()).not.toContain('月售');
    expect(wrapper.text()).not.toContain('¥undefined');
  });
});
