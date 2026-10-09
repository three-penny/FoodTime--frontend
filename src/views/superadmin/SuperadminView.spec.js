import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SuperadminView from './SuperadminView.vue';
import {
  getDashboard,
  listUsers,
  listAuditLogs,
} from '../../api/superadmin.api';

vi.mock('../../api/superadmin.api', () => ({
  getDashboard: vi.fn().mockResolvedValue({ data: { user_count: 1 } }),
  listUsers: vi.fn().mockResolvedValue({
    data: {
      items: [{ id: 'user-001', account: 'student', role: 'user' }],
      total: 1,
    },
  }),
  listAuditLogs: vi.fn().mockResolvedValue({
    data: { items: [{ id: 'log-1', detail: '测试操作日志' }], total: 1 },
  }),
}));

describe('SuperadminView', () => {
  it('loads users and logs only when their tabs are selected', async () => {
    const wrapper = mount(SuperadminView);
    await flushPromises();
    expect(getDashboard).toHaveBeenCalledTimes(1);
    expect(listUsers).not.toHaveBeenCalled();
    expect(listAuditLogs).not.toHaveBeenCalled();

    await wrapper.findAll('.sa-tabs button')[1].trigger('click');
    await flushPromises();
    expect(listUsers).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('student');

    await wrapper.findAll('.sa-tabs button')[2].trigger('click');
    await flushPromises();
    expect(listAuditLogs).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('测试操作日志');
    wrapper.unmount();
  });
});
