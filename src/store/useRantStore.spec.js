import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRantStore } from './useRantStore';

describe('useRantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a new rant as pending and publishes it after approval', () => {
    const store = useRantStore();

    const created = store.createRant({
      canteenId: 'xueyi',
      canteenName: '学一餐厅',
      content: '今天排队速度比预期快。',
      tag: '排队',
      author: '测试同学',
    });

    expect(store.rants[0]).toEqual(created);
    expect(created.status).toBe('pending');
    expect(store.todayPreview.some(item => item.id === created.id)).toBe(false);

    store.approveRant(created.id);

    expect(store.rants[0].status).toBe('approved');
    expect(store.todayPreview[0].content).toContain('排队速度');
    expect(store.totalCount).toBeGreaterThan(0);
  });

  it('supports rejecting a rant with a reason', () => {
    const store = useRantStore();
    const created = store.createRant({
      canteenId: 'xueyi',
      canteenName: '学一餐厅',
      content: '测试待审核吐槽。',
      tag: '其他',
      author: '测试同学',
    });

    store.rejectRant(created.id, '内容需要补充具体信息');

    expect(store.rants[0].status).toBe('rejected');
    expect(store.rants[0].reason).toBe('内容需要补充具体信息');
  });
});
