import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSubmissionStore } from './useSubmissionStore';
import { auditSubmission } from '../api/adminAudit.api';

vi.mock('../api/adminAudit.api', () => ({
  auditSubmission: vi.fn().mockResolvedValue({}),
}));

describe('useSubmissionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('creates a pending dish submission from upload form data', () => {
    const store = useSubmissionStore();

    const created = store.createSubmission({
      dishName: '手工水饺',
      canteenName: '明湖餐厅',
      stallName: '面食窗口',
      price: 12,
      imageName: 'dumpling.jpg',
      description: '明湖餐厅面食窗口新增水饺类菜品，包含猪肉白菜馅。',
      tags: ['面食'],
    });

    expect(created.status).toBe('pending');
    expect(created.rating).toBeUndefined();
    expect(store.submissions[0].dishName).toBe('手工水饺');
    expect(store.pendingCount).toBeGreaterThan(0);
  });

  it('supports approving and rejecting submissions', async () => {
    const store = useSubmissionStore();

    const created = store.createSubmission({
      dishName: '测试菜品',
      canteenName: '测试食堂',
      stallName: '测试档口',
      price: 10,
      description: '测试描述',
      tags: ['测试'],
    });
    const targetId = created.id;

    await store.approveSubmission(targetId);
    expect(store.submissions[0].status).toBe('approved');
    expect(auditSubmission).toHaveBeenCalledWith(targetId, expect.objectContaining({ status: 'approved' }));

    await store.rejectSubmission(targetId, '图片不清晰');
    expect(store.submissions[0].status).toBe('rejected');
    expect(store.submissions[0].reason).toBe('图片不清晰');
    expect(auditSubmission).toHaveBeenCalledWith(targetId, expect.objectContaining({ status: 'rejected', reason: '图片不清晰' }));
  });
});
