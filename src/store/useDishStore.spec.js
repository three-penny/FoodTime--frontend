import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDishStore } from './useDishStore';
import { createReview } from '../api/review.api';

vi.mock('../api/review.api', () => ({
  createReview: vi.fn().mockImplementation(async payload => ({
    data: { id: 'review-1', rating: payload.rating, comment: payload.comment },
  })),
}));

vi.mock('../api/dish.api', () => ({
  fetchDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchTopDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchDishById: vi.fn().mockResolvedValue({ data: null }),
  fetchDishReviews: vi.fn().mockResolvedValue({ data: [] }),
  recommendDish: vi.fn().mockResolvedValue({}),
  avoidDish: vi.fn().mockResolvedValue({}),
}));

vi.mock('../api/canteen.api', () => ({
  fetchCanteenDishes: vi.fn().mockResolvedValue({ data: [] }),
  fetchCanteens: vi.fn().mockResolvedValue({ data: [] }),
  fetchCanteenById: vi.fn().mockResolvedValue({ data: null }),
  fetchCanteenSpots: vi.fn().mockResolvedValue({ data: [] }),
  fetchStallsByCanteen: vi.fn().mockResolvedValue({ data: [] }),
  fetchRankings: vi.fn().mockResolvedValue({ data: [] }),
}));

describe('useDishStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('propagates submission errors without adding a fake review', async () => {
    const store = useDishStore();
    const existing = { id: 'existing-review' };
    store.appendReview('dish-1', existing);
    createReview.mockRejectedValueOnce(new Error('点评提交失败'));

    await expect(store.createDishReview({ dishId: 'dish-1', rating: 4, comment: '测试' }))
      .rejects.toThrow('点评提交失败');
    expect(store.getReviewsByDishId('dish-1')).toEqual([existing]);
  });

  it('appends the server review locally without sending another request', () => {
    const store = useDishStore();
    const review = { id: 'server-review', rating: 4.5, comment: '服务端记录' };
    const callsBefore = createReview.mock.calls.length;
    store.appendReview('dish-1', review);
    expect(store.getReviewsByDishId('dish-1')).toEqual([review]);
    expect(createReview.mock.calls.length).toBe(callsBefore);
  });

  it('creates a dish review with star rating and comment text', async () => {
    const store = useDishStore();

    const created = await store.createDishReview({
      dishId: 'black-pepper-chicken',
      rating: 4,
      comment: '鸡腿外皮比较香，米饭分量也够。',
      reviewer: '2024211001',
    });

    expect(created.rating).toBe(4);
    expect(created.comment).toContain('鸡腿');
    expect(store.getReviewsByDishId('black-pepper-chicken')[0]).toEqual(created);
  });

  it('keeps dish review rating within one to five stars', async () => {
    const store = useDishStore();

    const created = await store.createDishReview({
      dishId: 'tomato-beef-rice',
      rating: 8,
      comment: '番茄味明显。',
    });

    expect(created.rating).toBe(5);
  });

  it('keeps half-star dish review values', async () => {
    const store = useDishStore();

    const created = await store.createDishReview({
      dishId: 'tomato-beef-rice',
      rating: 4.5,
      comment: '半星评分测试。',
    });

    expect(created.rating).toBe(4.5);
  });

  it('finds generated stall dishes for dish detail routes', () => {
    const store = useDishStore();
    store.dishes = [
      {
        id: 'xueyi-northwest-noodles-1',
        name: '油泼扯面',
        canteenId: 'xueyi',
        price: 15,
        rating: 4.9,
        stall: '西北面食',
        valueNote: '西北面食',
        tags: ['西北面食'],
        image: '',
      },
    ];

    const dish = store.getDishById('xueyi-northwest-noodles-1');

    expect(dish.name).toBe('油泼扯面');
    expect(dish.canteenId).toBe('xueyi');
  });
});
