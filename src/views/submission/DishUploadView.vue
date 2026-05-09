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
        <label>
          <span>标签，用逗号分隔</span>
          <input v-model.trim="tagText" type="text" />
        </label>

        <p v-if="message" class="upload-form__message">{{ message }}</p>
        <div class="upload-form__actions">
          <button class="button-ink is-primary" type="submit">提交审核</button>
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
 * 职责：提供用户上传菜品信息的表单，并把投稿写入前端投稿状态池。
 * 作者：XXXXX
 * 使用场景：普通用户提交新增菜品、补充食堂菜品信息。
 * 依赖：Pinia、Vue Router、useCanteenStore、useSubmissionStore。
 */
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useSubmissionStore } from '../../store/useSubmissionStore';

defineOptions({
  name: 'DishUploadView',
});

const router = useRouter();
const canteenStore = useCanteenStore();
const submissionStore = useSubmissionStore();
const message = ref('');
const tagText = ref('校园推荐,新菜');

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
  return tagText.value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

function handleImageChange(event) {
  const [file] = Array.from(event.target.files ?? []);
  form.imageName = file?.name ?? '';
  message.value = '';
}

function handleSubmit() {
  if (!form.dishName || !form.canteenName || !form.stallName) {
    message.value = '请至少填写菜名、食堂和档口。';
    return;
  }

  if (!form.description) {
    message.value = '请补充菜品说明，方便审核同学确认是否为新菜。';
    return;
  }

  submissionStore.createSubmission({
    ...form,
    tags: getTags(),
  });
  message.value = '已提交审核，可以在我的投稿中查看进度。';
  router.push({ name: 'userSubmissions' });
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
