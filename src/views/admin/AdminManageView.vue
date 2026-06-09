<template>
  <section class="admin-manage-view">
    <div class="section-rule">
      <span class="section-rule__index">07</span>
      <span class="section-rule__line"></span>
    </div>

    <header class="manage-hero torn-edge">
      <div>
        <span class="sticker sticker--r-1">管理台</span>
        <h1>食堂内容管理</h1>
        <p class="handwrite">添加食堂、档口和菜品，修改后即时生效。</p>
      </div>
    </header>

    <nav class="manage-tabs">
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

    <!-- 添加食堂 -->
    <section v-if="activeTab === 'canteen'" class="manage-form torn-edge">
      <h2>添加食堂</h2>
      <label>食堂ID <input v-model="canteenForm.id" placeholder="如 xuewu" /></label>
      <label>名称 <input v-model="canteenForm.name" /></label>
      <label>简称 <input v-model="canteenForm.shortName" /></label>
      <label>评分 <input v-model.number="canteenForm.rating" type="number" step="0.1" min="0" max="5" /></label>
      <label>位置 <input v-model="canteenForm.location" /></label>
      <label>营业时间 <input v-model="canteenForm.openHours" placeholder="如 06:30 - 21:30" /></label>
      <label>人均 <input v-model="canteenForm.avgPrice" placeholder="如 人均 ¥12 - ¥18" /></label>
      <label>高峰时段 <input v-model="canteenForm.peakQueue" placeholder="如 11:45 - 12:15" /></label>
      <label>推荐时段 <input v-model="canteenForm.bestTime" placeholder="如 11:20 前" /></label>
      <label>简介 <textarea v-model="canteenForm.summary" rows="3"></textarea></label>
      <label>吐槽 <textarea v-model="canteenForm.rant" rows="2"></textarea></label>
      <label>特色标签（逗号分隔） <input v-model="canteenForm.features" placeholder="如 家常稳定, 出餐快" /></label>
      <label>招牌菜（逗号分隔） <input v-model="canteenForm.signatureDishes" placeholder="如 二代水煮鱼, 三鲜烩肉片" /></label>
      <p v-if="canteenMsg" class="form-msg">{{ canteenMsg }}</p>
      <button class="button-ink is-primary" type="button" :disabled="canteenSaving" @click="saveCanteen">
        {{ canteenSaving ? '创建中...' : '创建食堂' }}
      </button>
    </section>

    <!-- 添加档口 -->
    <section v-if="activeTab === 'stall'" class="manage-form torn-edge">
      <h2>添加档口</h2>
      <label>所属食堂
        <select v-model="stallForm.canteenId">
          <option value="">请选择食堂</option>
          <option v-for="c in canteens" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <label>档口ID <input v-model="stallForm.id" placeholder="如 xuewu-noodle-window" /></label>
      <label>名称 <input v-model="stallForm.name" /></label>
      <label>人均 <input v-model="stallForm.avgPrice" placeholder="如 ¥12 - ¥20" /></label>
      <label>推荐时段 <input v-model="stallForm.bestTime" /></label>
      <label>简介 <textarea v-model="stallForm.summary" rows="2"></textarea></label>
      <p v-if="stallMsg" class="form-msg">{{ stallMsg }}</p>
      <button class="button-ink is-primary" type="button" :disabled="stallSaving" @click="saveStall">
        {{ stallSaving ? '创建中...' : '创建档口' }}
      </button>
    </section>

    <!-- 添加菜品 -->
    <section v-if="activeTab === 'dish'" class="manage-form torn-edge">
      <h2>添加菜品</h2>
      <label>所属食堂
        <select v-model="dishForm.canteenId" @change="onCanteenChange">
          <option value="">请选择食堂</option>
          <option v-for="c in canteens" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <label>所属档口
        <select v-model="dishForm.stallId">
          <option value="">请选择档口</option>
          <option v-for="s in stalls" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </label>
      <label>菜品名称 <input v-model="dishForm.name" /></label>
      <label>价格 <input v-model.number="dishForm.price" type="number" /></label>
      <label>评分 <input v-model.number="dishForm.rating" type="number" step="0.1" min="0" max="5" /></label>
      <label>描述 <textarea v-model="dishForm.description" rows="2"></textarea></label>
      <label>性价比备注 <input v-model="dishForm.valueNote" /></label>
      <p v-if="dishMsg" class="form-msg">{{ dishMsg }}</p>
      <button class="button-ink is-primary" type="button" :disabled="dishSaving" @click="saveDish">
        {{ dishSaving ? '创建中...' : '创建菜品' }}
      </button>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { fetchCanteens, createCanteen, createStall, fetchStallsByCanteen } from '../../api/canteen.api';
import { createDish } from '../../api/dish.api';

defineOptions({ name: 'AdminManageView' });

const tabs = [
  { key: 'canteen', index: '01', label: '添加食堂' },
  { key: 'stall', index: '02', label: '添加档口' },
  { key: 'dish', index: '03', label: '添加菜品' },
];

const activeTab = ref('canteen');
const canteens = ref([]);
const stalls = ref([]);

onMounted(async () => {
  try {
    const res = await fetchCanteens();
    canteens.value = res.data || [];
  } catch (e) {
    console.error('加载食堂列表失败:', e);
  }
});

// 添加食堂
const canteenForm = reactive({ id: '', name: '', shortName: '', rating: 5, location: '', openHours: '', avgPrice: '', peakQueue: '', bestTime: '', summary: '', rant: '', features: '', signatureDishes: '' });
const canteenSaving = ref(false);
const canteenMsg = ref('');

async function saveCanteen() {
  canteenSaving.value = true;
  canteenMsg.value = '';
  try {
    const features = canteenForm.features ? canteenForm.features.split(',').map(s => s.trim()).filter(Boolean) : [];
    const sigDishes = canteenForm.signatureDishes ? canteenForm.signatureDishes.split(',').map(s => s.trim()).filter(Boolean) : [];
    await createCanteen({
      id: canteenForm.id || undefined,
      name: canteenForm.name,
      short_name: canteenForm.shortName,
      rating: canteenForm.rating,
      location: canteenForm.location,
      open_hours: canteenForm.openHours,
      avg_price: canteenForm.avgPrice,
      peak_queue: canteenForm.peakQueue,
      best_time: canteenForm.bestTime,
      summary: canteenForm.summary,
      rant: canteenForm.rant,
      features,
      signature_dishes: sigDishes,
    });
    canteenMsg.value = '创建成功！';
    Object.assign(canteenForm, { id: '', name: '', shortName: '', rating: 5, location: '', openHours: '', avgPrice: '', peakQueue: '', bestTime: '', summary: '', rant: '', features: '', signatureDishes: '' });
    const res = await fetchCanteens();
    canteens.value = res.data || [];
  } catch (e) {
    canteenMsg.value = e.message || '创建失败';
  } finally {
    canteenSaving.value = false;
  }
}

// 添加档口
const stallForm = reactive({ canteenId: '', id: '', name: '', avgPrice: '', bestTime: '', summary: '' });
const stallSaving = ref(false);
const stallMsg = ref('');

async function saveStall() {
  stallSaving.value = true;
  stallMsg.value = '';
  try {
    const canteen = canteens.value.find(c => c.id === stallForm.canteenId);
    await createStall(stallForm.canteenId, {
      id: stallForm.id || undefined,
      name: stallForm.name,
      avg_price: stallForm.avgPrice,
      best_time: stallForm.bestTime,
      summary: stallForm.summary,
    });
    stallMsg.value = `档口「${stallForm.name}」创建成功！`;
    Object.assign(stallForm, { canteenId: stallForm.canteenId, id: '', name: '', avgPrice: '', bestTime: '', summary: '' });
  } catch (e) {
    stallMsg.value = e.message || '创建失败';
  } finally {
    stallSaving.value = false;
  }
}

// 添加菜品
const dishForm = reactive({ canteenId: '', stallId: '', name: '', price: null, rating: 5, description: '', valueNote: '' });
const dishSaving = ref(false);
const dishMsg = ref('');

async function onCanteenChange() {
  dishForm.stallId = '';
  stalls.value = [];
  if (!dishForm.canteenId) return;
  try {
    const res = await fetchStallsByCanteen(dishForm.canteenId);
    stalls.value = res.data || [];
  } catch (e) {
    console.error('加载档口列表失败:', e);
  }
}

async function saveDish() {
  dishSaving.value = true;
  dishMsg.value = '';
  try {
    await createDish({
      name: dishForm.name,
      stall_id: dishForm.stallId,
      canteen_id: dishForm.canteenId,
      price: dishForm.price || null,
      rating: dishForm.rating,
      description: dishForm.description,
      value_note: dishForm.valueNote,
    });
    dishMsg.value = '菜品创建成功！';
    Object.assign(dishForm, { ...dishForm, name: '', price: null, rating: 5, description: '', valueNote: '' });
  } catch (e) {
    dishMsg.value = e.message || '创建失败';
  } finally {
    dishSaving.value = false;
  }
}
</script>

<style scoped lang="scss">
.manage-hero {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: clamp(18px, 4vw, 34px);
}
.manage-hero h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}
.manage-hero p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}
.manage-tabs {
  display: flex;
  gap: 8px;
  margin-top: var(--ft-space-2);
}
.manage-tabs button {
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: 10px 18px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  color: var(--ft-color-secondary);
  transition: all var(--ft-transition-fast);
}
.manage-tabs button.is-active {
  color: var(--ft-color-primary);
  border-color: var(--ft-color-primary);
  box-shadow: 3px 3px 0 rgb(58 36 24 / 60%);
  transform: rotate(-1deg);
}
.manage-tabs button span {
  font-size: 11px;
  color: rgb(58 36 24 / 60%);
  margin-right: 6px;
}
.manage-form {
  margin-top: var(--ft-space-2);
  border: 1px solid var(--ft-color-secondary);
  background: var(--ft-color-surface);
  padding: clamp(18px, 4vw, 30px);
  display: grid;
  gap: 12px;
  max-width: 600px;
}
.manage-form h2 {
  font-family: var(--zine-title-font);
  font-size: 32px;
  margin: 0;
}
.manage-form label {
  display: grid;
  gap: 3px;
  font-size: 13px;
  color: var(--ft-color-text-muted);
}
.manage-form input,
.manage-form textarea,
.manage-form select {
  border: 1px solid var(--ft-color-secondary);
  background: #fff;
  padding: 8px 12px;
  font: inherit;
  font-size: 14px;
}
.form-msg {
  color: var(--zine-stamp-red);
  font-size: 14px;
}
@media (max-width: 600px) {
  .manage-tabs {
    flex-wrap: wrap;
  }
}
</style>
