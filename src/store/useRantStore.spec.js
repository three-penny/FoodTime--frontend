import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRantStore } from './useRantStore';
import { createRant } from '../api/rant.api';

vi.mock('../api/rant.api', () => ({
  fetchRants: vi.fn().mockResolvedValue({ data: [] }),
  createRant: vi.fn().mockImplementation(async payload => ({
    data: { ...payload, id: 'server-rant', status: 'pending' },
  })),
  auditRant: vi.fn().mockResolvedValue({}),
}));

describe('useRantStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('propagates submission errors without adding a fake rant', async () => {
    const store = useRantStore();
    store.rants = [{ id: 'existing-rant', status: 'approved' }];
    createRant.mockRejectedValueOnce(new Error('吐槽提交失败'));

    await expect(store.createRant({ content: '测试吐槽' })).rejects.toThrow('吐槽提交失败');
    expect(store.rants).toEqual([{ id: 'existing-rant', status: 'approved' }]);
  });

  it('creates a new rant as pending and publishes it after approval', async () => {
    const store = useRantStore();

    const created = await store.createRant({
      canteenId: 'xueyi',
      canteenName: '学一餐厅',
      content: '今天排队速度比预期快。',
      tag: '排队',
      author: '测试同学',
    });

    expect(store.rants[0]).toEqual(created);
    expect(created.status).toBe('pending');
    expect(store.todayPreview.some(item => item.id === created.id)).toBe(false);

    await store.approveRant(created.id);

    expect(store.rants[0].status).toBe('approved');
    expect(store.todayPreview[0].content).toContain('排队速度');
    expect(store.totalCount).toBeGreaterThan(0);
  });

  it('supports rejecting a rant with a reason', async () => {
    const store = useRantStore();
    const created = await store.createRant({
      canteenId: 'xueyi',
      canteenName: '学一餐厅',
      content: '测试待审核吐槽。',
      tag: '其他',
      author: '测试同学',
    });

    await store.rejectRant(created.id, '内容需要补充具体信息');

    expect(store.rants[0].status).toBe('rejected');
    expect(store.rants[0].reason).toBe('内容需要补充具体信息');
  });
});
