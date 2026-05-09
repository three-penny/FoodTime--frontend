import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSubmissionStore } from './useSubmissionStore';

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

  it('supports approving and rejecting submissions', () => {
    const store = useSubmissionStore();
    const targetId = store.submissions[0].id;

    store.approveSubmission(targetId);
    expect(store.submissions[0].status).toBe('approved');

    store.rejectSubmission(targetId, '图片不清晰');
    expect(store.submissions[0].status).toBe('rejected');
    expect(store.submissions[0].reason).toBe('图片不清晰');
  });
});
