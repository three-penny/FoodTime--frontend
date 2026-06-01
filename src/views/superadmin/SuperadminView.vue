<!-- @author FoodTime Team -->

<template>
  <section class="sa-view">
    <div class="section-rule">
      <span class="section-rule__index">99</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="sa-header torn-edge">
      <div>
        <span class="sticker sticker--r-1">超级管理员</span>
        <h1>控制台</h1>
        <p class="handwrite">用户角色管理、操作日志审计与数据报表总览。</p>
      </div>
      <span class="sa-header__mark" aria-hidden="true">ROOT</span>
    </header>

    <article class="sa-panel torn-edge">
      <nav class="sa-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ 'is-active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span>{{ tab.index }}</span>
          {{ tab.label }}
        </button>
      </nav>

      <section v-if="activeTab === 'dashboard'" class="tab-section">
        <div class="panel-title">
          <span class="sticker sticker--r1">报表</span>
          <h2>数据总览</h2>
        </div>
        <div class="stats-grid">
          <div v-for="item in statItems" :key="item.label" class="stat-card">
            <em>{{ item.value }}</em>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </section>

      <section v-if="activeTab === 'users'" class="tab-section">
        <div class="panel-title">
          <span class="sticker sticker--r2">用户</span>
          <h2>用户管理</h2>
        </div>
        <div class="search-row">
          <input
            v-model="userSearch"
            type="text"
            placeholder="搜索账号/昵称/邮箱..."
            @keyup.enter="loadUsers()"
          />
          <button class="button-ink is-primary" type="button" @click="loadUsers()">搜索</button>
        </div>

        <div v-if="userLoading" class="empty-state">加载中...</div>
        <div v-else-if="users.length === 0" class="empty-state">暂无用户数据。</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>账号</th>
                <th>昵称</th>
                <th>角色</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.id">
                <td class="td-id">{{ u.id.slice(0, 8) }}...</td>
                <td>{{ u.account }}</td>
                <td>{{ u.nickname }}</td>
                <td>
                  <span :class="'role-tag role-' + u.role">{{ roleLabel(u.role) }}</span>
                </td>
                <td>
                  <span :class="'status-tag status-' + u.account_status">
                    {{ u.account_status === 'active' ? '正常' : '已封禁' }}
                  </span>
                </td>
                <td class="td-actions">
                  <select v-model="roleDrafts[u.id]" class="inline-select">
                    <option value="">--角色--</option>
                    <option value="user">用户</option>
                    <option value="admin">管理员</option>
                    <option value="superadmin">超级管理员</option>
                  </select>
                  <button class="button-ink is-small" type="button" @click="changeRole(u.id)">改角色</button>
                  <button
                    class="button-ink is-small"
                    :class="u.account_status === 'banned' ? 'is-primary' : 'is-danger'"
                    type="button"
                    @click="toggleStatus(u)"
                  >
                    {{ u.account_status === 'banned' ? '解封' : '封禁' }}
                  </button>
                  <button class="button-ink is-small" type="button" @click="openPasswordModal(u)">
                    改密码
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="userTotal > userPerPage" class="pager">
          <button
            class="button-ink"
            type="button"
            :disabled="userPage <= 1"
            @click="userPage--; loadUsers()"
          >上一页</button>
          <span>{{ userPage }} / {{ Math.ceil(userTotal / userPerPage) }}</span>
          <button
            class="button-ink"
            type="button"
            :disabled="userPage >= Math.ceil(userTotal / userPerPage)"
            @click="userPage++; loadUsers()"
          >下一页</button>
        </div>
      </section>

      <section v-if="activeTab === 'logs'" class="tab-section">
        <div class="panel-title">
          <span class="sticker sticker--r2">日志</span>
          <h2>操作日志</h2>
        </div>
        <div class="filter-row">
          <select v-model="logAction" @change="loadLogs()">
            <option value="">全部操作</option>
            <option value="role_change">角色变更</option>
            <option value="status_change">状态变更</option>
            <option value="password_change">密码重置</option>
          </select>
          <select v-model="logTargetType" @change="loadLogs()">
            <option value="">全部类型</option>
            <option value="user">用户</option>
            <option value="dish_submission">菜品提报</option>
            <option value="review">评价</option>
            <option value="rant">吐槽</option>
          </select>
        </div>

        <div v-if="logLoading" class="empty-state">加载中...</div>
        <div v-else-if="logs.length === 0" class="empty-state">暂无操作日志。</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>操作者</th>
                <th>操作</th>
                <th>目标类型</th>
                <th>详情</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{ log.operator_account || '系统' }}</td>
                <td><span class="action-tag">{{ actionLabel(log.action) }}</span></td>
                <td>{{ targetTypeLabel(log.target_type) }}</td>
                <td class="td-detail">{{ log.detail }}</td>
                <td class="td-time">{{ formatTime(log.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="logTotal > logPerPage" class="pager">
          <button class="button-ink" type="button" :disabled="logPage <= 1" @click="logPage--; loadLogs()">上一页</button>
          <span>{{ logPage }} / {{ Math.ceil(logTotal / logPerPage) }}</span>
          <button class="button-ink" type="button" :disabled="logPage >= Math.ceil(logTotal / logPerPage)" @click="logPage++; loadLogs()">下一页</button>
        </div>
      </section>
    </article>

    <div v-if="passwordModal.visible" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-card torn-edge">
        <div class="modal-card__head">
          <span class="sticker sticker--r2">密码</span>
          <h3>修改密码</h3>
        </div>
        <p class="modal-card__hint">为 {{ passwordModal.target?.nickname }}（{{ passwordModal.target?.account }}）设置新密码</p>
        <input
          v-model="passwordModal.password"
          type="password"
          class="modal-card__input"
          placeholder="输入新密码（至少6位）"
          maxlength="128"
          @keyup.enter="confirmPasswordChange"
        />
        <p v-if="passwordModal.success" class="modal-card__success">{{ passwordModal.success }}</p>
        <p v-if="passwordModal.error" class="modal-card__error">{{ passwordModal.error }}</p>
        <div class="modal-card__actions">
          <button class="button-ink is-primary" type="button" :disabled="passwordModal.submitting || passwordModal.success" @click="confirmPasswordChange">
            {{ passwordModal.submitting ? '修改中...' : passwordModal.success ? '已完成' : '确认修改' }}
          </button>
          <button class="button-ink" type="button" :disabled="passwordModal.submitting" @click="closePasswordModal">
            {{ passwordModal.success ? '关闭' : '取消' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import {
  listUsers, setUserRole, setUserStatus, changeUserPassword,
  listAuditLogs, getDashboard,
} from '../../api/superadmin.api';

defineOptions({ name: 'SuperadminView' });

const activeTab = ref('dashboard');

const tabs = [
  { key: 'dashboard', index: '01', label: '数据报表' },
  { key: 'users', index: '02', label: '用户管理' },
  { key: 'logs', index: '03', label: '操作日志' },
];

const stats = ref({});
onMounted(async () => {
  await loadStats();
});

async function loadStats() {
  try {
    const res = await getDashboard();
    if (res.data) stats.value = res.data;
  } catch { /* ignore */ }
}

const statItems = computed(() => [
  { label: '用户总数', value: stats.value.user_count ?? '-' },
  { label: '普通用户', value: stats.value.user_count ? (stats.value.user_count - (stats.value.admin_count || 0) - (stats.value.superadmin_count || 0)) : '-' },
  { label: '今日新增', value: stats.value.user_today ?? '-' },
  { label: '管理员', value: stats.value.admin_count ?? '-' },
  { label: '活跃用户', value: stats.value.active_users ?? '-' },
  { label: '封禁用户', value: stats.value.banned_users ?? '-' },
  { label: '食堂数', value: stats.value.canteen_count ?? '-' },
  { label: '档口数', value: stats.value.stall_count ?? '-' },
  { label: '菜品数', value: stats.value.dish_count ?? '-' },
  { label: '评价数', value: stats.value.total_reviews ?? '-' },
  { label: '待审评价', value: stats.value.pending_reviews ?? '-' },
  { label: '吐槽数', value: stats.value.total_rants ?? '-' },
  { label: '待审吐槽', value: stats.value.pending_rants ?? '-' },
  { label: '提报数', value: stats.value.total_submissions ?? '-' },
  { label: '待审提报', value: stats.value.pending_submissions ?? '-' },
  { label: '邀请码数', value: stats.value.total_invite_codes ?? '-' },
]);

const users = ref([]);
const userTotal = ref(0);
const userPage = ref(1);
const userPerPage = 20;
const userSearch = ref('');
const userLoading = ref(false);
const roleDrafts = reactive({});

async function loadUsers() {
  userLoading.value = true;
  try {
    const res = await listUsers({ page: userPage.value, per_page: userPerPage, search: userSearch.value });
    if (res.data) {
      users.value = res.data.items || [];
      userTotal.value = res.data.total || 0;
      users.value.forEach(u => { if (!(u.id in roleDrafts)) roleDrafts[u.id] = ''; });
    }
  } catch { /* ignore */ }
  userLoading.value = false;
}

function roleLabel(role) {
  const map = { user: '用户', admin: '管理员', superadmin: '超级管理员' };
  return map[role] || role;
}

async function changeRole(userId) {
  const newRole = roleDrafts[userId];
  if (!newRole) return;
  try {
    await setUserRole(userId, newRole);
    const u = users.value.find(item => item.id === userId);
    if (u) u.role = newRole;
    roleDrafts[userId] = '';
  } catch (e) {
    alert(e.message || '操作失败');
  }
}

const passwordModal = reactive({
  visible: false,
  target: null,
  password: '',
  error: '',
  success: '',
  submitting: false,
});

function openPasswordModal(user) {
  passwordModal.target = user;
  passwordModal.password = '';
  passwordModal.error = '';
  passwordModal.success = '';
  passwordModal.submitting = false;
  passwordModal.visible = true;
}

function closePasswordModal() {
  passwordModal.visible = false;
  passwordModal.target = null;
  passwordModal.password = '';
  passwordModal.error = '';
  passwordModal.success = '';
}

async function confirmPasswordChange() {
  if (!passwordModal.password) {
    passwordModal.error = '密码不能为空。';
    return;
  }
  if (passwordModal.password.length < 6) {
    passwordModal.error = '密码长度不能少于 6 位。';
    return;
  }
  passwordModal.submitting = true;
  passwordModal.error = '';
  try {
    await changeUserPassword(passwordModal.target.id, passwordModal.password);
    passwordModal.success = '密码修改成功。';
    passwordModal.password = '';
    setTimeout(() => closePasswordModal(), 1200);
  } catch (e) {
    passwordModal.error = e.message || '操作失败';
  } finally {
    passwordModal.submitting = false;
  }
}

async function toggleStatus(user) {
  const newStatus = user.account_status === 'banned' ? 'active' : 'banned';
  try {
    await setUserStatus(user.id, newStatus);
    user.account_status = newStatus;
  } catch (e) {
    alert(e.message || '操作失败');
  }
}

const logs = ref([]);
const logTotal = ref(0);
const logPage = ref(1);
const logPerPage = 20;
const logAction = ref('');
const logTargetType = ref('');
const logLoading = ref(false);

async function loadLogs() {
  logLoading.value = true;
  try {
    const res = await listAuditLogs({
      page: logPage.value, per_page: logPerPage,
      action: logAction.value, target_type: logTargetType.value,
    });
    if (res.data) {
      logs.value = res.data.items || [];
      logTotal.value = res.data.total || 0;
    }
  } catch { /* ignore */ }
  logLoading.value = false;
}

function actionLabel(action) {
  const map = { role_change: '角色变更', status_change: '状态变更', password_change: '密码重置' };
  return map[action] || action;
}

function targetTypeLabel(type) {
  const map = { user: '用户', dish_submission: '菜品提报', review: '评价', rant: '吐槽' };
  return map[type] || type;
}

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('zh-CN');
}
</script>

<style scoped lang="scss">
.sa-view { min-width: 0; }

.sa-header, .sa-panel {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
}

.sa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: clamp(18px, 4vw, 34px);

  h1 {
    margin: 16px 0 0;
    font-family: var(--zine-title-font);
    font-size: clamp(50px, 7vw, 90px);
    line-height: 0.9;
  }

  p { margin: 14px 0 0; color: var(--zine-stamp-red); font-size: 26px; }
}

.sa-header__mark {
  border: 2px dashed var(--zine-stamp-red);
  color: var(--zine-stamp-red);
  background: var(--zine-stamp-red-soft);
  font-family: var(--zine-title-font);
  font-weight: 900;
  padding: 18px 14px;
  transform: rotate(6deg);
  mix-blend-mode: multiply;
}

.sa-panel {
  margin-top: var(--ft-space-3);
  padding: 18px;
  box-shadow: 4px 5px 0 rgb(58 36 24 / 12%);
}

.sa-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  border-bottom: 1px dashed rgb(58 36 24 / 28%);
  padding-bottom: 16px;

  button {
    position: relative;
    min-height: 58px;
    border: 1px solid rgb(58 36 24 / 42%);
    background: linear-gradient(90deg, rgb(255 255 255 / 18%), transparent 72%), var(--zine-paper-card-alt);
    color: var(--ft-color-secondary);
    cursor: pointer;
    font: inherit;
    font-weight: 800;
    padding: 12px 14px;
    text-align: left;
    box-shadow: 3px 3px 0 rgb(58 36 24 / 16%);
    transition: transform var(--ft-transition-fast), border-color var(--ft-transition-fast), box-shadow var(--ft-transition-fast);

    &:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 rgb(58 36 24 / 22%); }

    &.is-active {
      border-color: var(--ft-color-primary);
      color: var(--ft-color-primary);
      box-shadow: 4px 4px 0 rgb(58 36 24 / 34%);
      transform: rotate(-0.7deg);
    }

    span { display: block; margin: 0 0 2px; color: rgb(58 36 24 / 54%); font-size: 12px; letter-spacing: 0.08em; }
  }
}

.tab-section { margin-top: 18px; }

.panel-title h2 {
  margin: 12px 0 0;
  font-family: var(--zine-title-font);
  font-size: 34px;
  line-height: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.stat-card {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 62%);
  padding: 14px;

  em {
    display: block;
    color: var(--ft-color-primary);
    font-family: var(--zine-title-font);
    font-size: 36px;
    font-style: normal;
    font-weight: 900;
    line-height: 0.9;
  }

  span { display: block; margin-top: 4px; color: var(--ft-color-text-muted); font-size: 13px; }
}

.search-row, .filter-row {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;

  input, select {
    border: 1px solid var(--ft-color-secondary);
    background: #fffaf0;
    padding: 10px 12px;
    font: inherit;
    font-size: 15px;
    outline: none;
  }

  input { flex: 1; min-width: 200px; }
}

.table-wrap {
  margin-top: 14px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th, td { border: 1px solid rgb(58 36 24 / 22%); padding: 10px 12px; text-align: left; }
  th { background: var(--zine-paper-card-alt); font-weight: 800; color: var(--ft-color-secondary); }
  td { background: rgb(255 250 240 / 40%); }
}

.td-id { font-family: monospace; font-size: 12px; color: var(--ft-color-text-muted); }
.td-time { white-space: nowrap; font-size: 12px; color: var(--ft-color-text-muted); }
.td-detail { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.td-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

.inline-select {
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  padding: 6px 8px;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.role-tag, .status-tag, .action-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 2px;
}

.role-user { border: 1px solid var(--ft-color-text-muted); color: var(--ft-color-text-muted); }
.role-admin { border: 1px solid var(--ft-color-primary); color: var(--ft-color-primary); }
.role-superadmin { border: 1px solid var(--zine-stamp-red); color: var(--zine-stamp-red); }

.status-active { border: 1px solid var(--ft-color-accent); color: var(--ft-color-accent); }
.status-banned { border: 1px solid var(--zine-stamp-red); color: var(--zine-stamp-red); }

.action-tag { border: 1px solid var(--ft-color-secondary); color: var(--ft-color-secondary); }

.is-small { padding: 6px 10px; font-size: 13px; }
.is-danger { border-color: var(--zine-stamp-red); color: var(--zine-stamp-red); }

.empty-state {
  border: 1px dashed rgb(58 36 24 / 34%);
  background: rgb(255 250 240 / 62%);
  color: var(--ft-color-text-muted);
  padding: 14px;
  margin-top: 14px;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

@media (max-width: 680px) {
  .sa-tabs, .stats-grid { grid-template-columns: 1fr; }
  .td-actions { flex-direction: column; align-items: flex-start; }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 32%);
  padding: 16px;
}

.modal-card {
  width: min(400px, 100%);
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: 22px;
  box-shadow: 8px 8px 0 rgb(58 36 24 / 16%);
}

.modal-card__head {
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    margin: 0;
    font-family: var(--zine-title-font);
    font-size: 28px;
    line-height: 1;
  }
}

.modal-card__hint {
  margin: 14px 0 0;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.modal-card__input {
  width: 100%;
  margin-top: 12px;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  padding: 12px 14px;
  font: inherit;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}

.modal-card__error {
  margin: 8px 0 0;
  color: var(--zine-stamp-red);
  font-size: 13px;
}

.modal-card__success {
  margin: 8px 0 0;
  color: var(--ft-color-accent);
  font-weight: 700;
  font-size: 15px;
}

.modal-card__actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}


</style>
