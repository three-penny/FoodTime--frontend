<!-- @author XXXXX -->

<template>
  <section class="dish-upload-view">
    <div class="section-rule">
      <span class="section-rule__index">12</span>
      <span class="section-rule__line"></span>
    </div>

    <article class="upload-paper torn-edge">
      <header class="upload-paper__header">
        <span class="sticker sticker--r-1">上传菜品</span>
        <h1>把新菜记进食堂手账</h1>
        <p class="handwrite">
          上传平台里还没有的菜品信息，提交后会进入待审核列表。
        </p>
      </header>

      <form class="upload-form" @submit.prevent="handleSubmit">
        <div class="upload-form__grid">
          <label>
            <span>菜品名称</span>
            <input v-model.trim="form.dishName" type="text" />
          </label>
          <label>
            <span>所在食堂</span>
            <select v-model="form.canteenName">
              <option value="">请选择食堂</option>
              <option
                v-for="canteen in canteens"
                :key="canteen.id"
                :value="canteen.name"
              >
                {{ canteen.name }}
              </option>
            </select>
          </label>
          <label>
            <span>档口名称</span>
            <input v-model.trim="form.stallName" type="text" />
          </label>
          <label>
            <span>价格</span>
            <input v-model.number="form.price" min="0" type="number" />
          </label>
          <label>
            <span>菜品图片</span>
            <input accept="image/*" type="file" @change="handleImageChange" />
          </label>
        </div>

        <p v-if="form.imageName" class="upload-form__file">
          已选择：{{ form.imageName }}
        </p>

        <label>
          <span>菜品说明</span>
          <textarea
            v-model.trim="form.description"
            maxlength="220"
            rows="5"
          ></textarea>
        </label>
        <div class="upload-form__tags">
          <span class="upload-form__tags-label">标签</span>
          <div class="tag-list">
            <span
              v-for="(tag, index) in tags"
              :key="index"
              class="tag-chip"
            >
              {{ tag }}
              <button
                type="button"
                class="tag-chip__close"
                @click="removeTag(index)"
              >
                &times;
              </button>
            </span>
            <span v-if="!addingTag" class="tag-add" @click="startAddTag">+</span>
          </div>
          <div v-if="addingTag" class="tag-input-row">
            <input
              ref="tagInputRef"
              v-model.trim="newTagText"
              type="text"
              maxlength="20"
              @keyup.enter="confirmTag"
              @keyup.escape="cancelTag"
            />
            <button class="tag-btn tag-btn--confirm" type="button" @click="confirmTag">
              确认
            </button>
            <button class="tag-btn tag-btn--cancel" type="button" @click="cancelTag">
              取消
            </button>
          </div>
        </div>

        <p v-if="message" class="upload-form__message">{{ message }}</p>
        <div class="upload-form__actions">
          <button class="button-ink is-primary" type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交审核' }}
          </button>
          <button class="button-ink" type="button" @click="goSubmissions">
            查看我的投稿
          </button>
        </div>
      </form>
    </article>
  </section>
</template>

<script setup>
/**
 * DishUploadView
 * 职责：提供用户上传菜品信息的表单，支持图片上传并提交至后端审核。
 * 作者：XXXXX
 * 使用场景：普通用户提交新增菜品、补充食堂菜品信息。
 * 依赖：Pinia、Vue Router、useCanteenStore、useAuthStore、submission.api.js。
 */
import { computed, nextTick, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubmissionStore } from '../../store/useSubmissionStore';
import { createSubmission } from '../../api/submission.api';

defineOptions({
  name: 'DishUploadView',
});

const router = useRouter();
const canteenStore = useCanteenStore();
const authStore = useAuthStore();
const submissionStore = useSubmissionStore();
const message = ref('');
const submitting = ref(false);
const tags = reactive(['校园推荐', '新菜']);
const addingTag = ref(false);
const newTagText = ref('');
const tagInputRef = ref(null);
const imageFile = ref(null);

const form = reactive({
  dishName: '',
  canteenName: '',
  stallName: '',
  price: 12,
  imageName: '',
  description: '',
});

const canteens = computed(() => canteenStore.canteens);

function getTags() {
  return tags.filter(Boolean);
}

function startAddTag() {
  addingTag.value = true;
  newTagText.value = '';
  nextTick(() => {
    tagInputRef.value?.focus();
  });
}

function confirmTag() {
  const text = newTagText.value;
  if (text && !tags.includes(text)) {
    tags.push(text);
  }
  newTagText.value = '';
  addingTag.value = false;
}

function cancelTag() {
  newTagText.value = '';
  addingTag.value = false;
}

function removeTag(index) {
  tags.splice(index, 1);
}

function handleImageChange(event) {
  const [file] = Array.from(event.target.files ?? []);
  if (file) {
    imageFile.value = file;
    form.imageName = file.name;
  } else {
    imageFile.value = null;
    form.imageName = '';
  }
  message.value = '';
}

async function handleSubmit() {
  if (!form.dishName || !form.canteenName || !form.stallName) {
    message.value = '请至少填写菜名、食堂和档口。';
    return;
  }

  if (!form.description) {
    message.value = '请补充菜品说明，方便审核同学确认是否为新菜。';
    return;
  }

  if (!authStore.session?.account) {
    message.value = '请先登录后再提交菜品。';
    return;
  }

  submitting.value = true;
  message.value = '';

  try {
    const fd = new FormData();
    fd.append('dish_name', form.dishName);
    fd.append('canteen_name', form.canteenName);
    fd.append('stall_name', form.stallName);
    fd.append('price', String(form.price || ''));
    fd.append('description', form.description);
    fd.append('tags', getTags().join(','));
    fd.append('submitter_account', authStore.session.account);
    if (imageFile.value) {
      fd.append('image', imageFile.value);
    }

    const res = await createSubmission(fd);
    // 即时写入 store，避免依赖后续 refetch
    submissionStore.appendSubmission(res.data);
    message.value = '已提交审核，可以在我的投稿中查看进度。';
    setTimeout(() => {
      router.push({ name: 'userSubmissions' });
    }, 800);
  } catch (e) {
    message.value = e.message || '提交失败，请稍后重试。';
  } finally {
    submitting.value = false;
  }
}

function goSubmissions() {
  router.push({ name: 'userSubmissions' });
}
</script>

<style scoped lang="scss">
.dish-upload-view {
  min-width: 0;
}

.upload-paper {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  padding: clamp(20px, 4vw, 38px);
}

.upload-paper__header h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(46px, 7vw, 82px);
  line-height: 0.9;
}

.upload-paper__header p {
  margin: 14px 0 0;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.upload-form {
  margin-top: var(--ft-space-3);
  display: grid;
  gap: 16px;
}

.upload-form__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.upload-form label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.upload-form input,
.upload-form select,
.upload-form textarea {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.upload-form textarea {
  resize: vertical;
}

.upload-form input[type='file'] {
  cursor: pointer;
}

.upload-form__file {
  margin: 0;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.upload-form__message {
  margin: 0;
  color: var(--zine-stamp-red);
}

.upload-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.upload-form__tags {
  display: grid;
  gap: 8px;
}

.upload-form__tags-label {
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tag-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font-size: 14px;
  padding: 6px 22px 6px 10px;
}

.tag-chip__close {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border: none;
  background: none;
  color: var(--zine-stamp-red);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.tag-chip__close:hover {
  color: var(--ft-color-primary);
}

.tag-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px dashed var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
}

.tag-add:hover {
  border-style: solid;
  color: var(--ft-color-primary);
  border-color: var(--ft-color-primary);
}

.tag-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tag-input-row input {
  width: 160px;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  font-size: 14px;
  padding: 6px 10px;
  outline: none;
}

.tag-btn {
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  padding: 5px 10px;
}

.tag-btn--confirm {
  border-color: var(--ft-color-primary);
  color: var(--ft-color-primary);
}

.tag-btn--cancel {
  opacity: 0.7;
}

.tag-btn--cancel:hover {
  opacity: 1;
}

@media (max-width: 900px) {
  .upload-form__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .upload-paper {
    padding: 18px;
  }

  .upload-paper__header h1 {
    font-size: clamp(38px, 13vw, 54px);
  }

  .upload-paper__header p {
    font-size: 22px;
  }

  .upload-form__actions {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
