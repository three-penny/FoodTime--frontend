import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRantStore } from './useRantStore';

describe('useRantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a new rant and updates today preview immediately', () => {
    const store = useRantStore();

    const created = store.createRant({
      canteenId: 'xueyi',
      canteenName: '学一餐厅',
      content: '今天排队速度比预期快。',
      tag: '排队',
      author: '测试同学',
    });

    expect(store.rants[0]).toEqual(created);
    expect(store.todayPreview[0].content).toContain('排队速度');
    expect(store.totalCount).toBeGreaterThan(0);
  });
});
