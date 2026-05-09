import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDishStore } from './useDishStore';

describe('useDishStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a dish review with star rating and comment text', () => {
    const store = useDishStore();

    const created = store.createDishReview({
      dishId: 'black-pepper-chicken',
      rating: 4,
      comment: '鸡腿外皮比较香，米饭分量也够。',
      reviewer: '2024211001',
    });

    expect(created.rating).toBe(4);
    expect(created.comment).toContain('鸡腿');
    expect(store.getReviewsByDishId('black-pepper-chicken')[0]).toEqual(created);
  });

  it('keeps dish review rating within one to five stars', () => {
    const store = useDishStore();

    const created = store.createDishReview({
      dishId: 'tomato-beef-rice',
      rating: 8,
      comment: '番茄味明显。',
    });

    expect(created.rating).toBe(5);
  });

  it('keeps half-star dish review values', () => {
    const store = useDishStore();

    const created = store.createDishReview({
      dishId: 'tomato-beef-rice',
      rating: 4.5,
      comment: '半星评分测试。',
    });

    expect(created.rating).toBe(4.5);
  });

  it('finds generated stall dishes for dish detail routes', () => {
    const store = useDishStore();

    const dish = store.getDishById('xueyi-northwest-noodles-1');

    expect(dish.name).toBe('油泼扯面');
    expect(dish.canteenId).toBe('xueyi');
  });
});
