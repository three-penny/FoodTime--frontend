<!-- @author XXXXX -->

<template>
  <section class="review-view">
    <div class="section-rule">
      <span class="section-rule__index">08</span>
      <span class="section-rule__line"></span>
    </div>

    <article class="review-paper torn-edge">
      <div class="review-paper__main">
        <span class="sticker sticker--r-1">点评投稿</span>
        <h1>点评这道菜</h1>
        <p class="review-paper__lead handwrite">
          点击星星完成评分，再写下你对这道菜的真实评论。
        </p>

        <ReviewTargetPicker
          :model-value="target"
          :canteens="canteens"
          :stall-options="stallOptions"
          :dish-options="dishOptions"
          @select-canteen="handleCanteenChange"
          @select-stall="handleStallChange"
          @select-dish="handleDishChange"
        />

        <article v-if="dish && canteen" class="review-target">
          <span class="stamp">{{ dish.name }}</span>
          <p>
            {{ canteen.name }} · {{ dish.stall ?? dish.valueNote }} · ¥{{ dish.price }}
          </p>
        </article>

        <form class="review-form" @submit.prevent="handleSubmit">
          <StarRatingInput v-model="form.rating" />

          <label>
            <span>文字评论</span>
            <textarea
              v-model.trim="form.comment"
              rows="5"
              placeholder="可以写味道、分量、出餐速度、排队情况等。"
              maxlength="220"
            ></textarea>
          </label>

          <p v-if="message" class="review-form__message">{{ message }}</p>

          <div class="review-form__actions">
            <button class="button-ink is-primary" type="submit">提交点评</button>
            <button class="button-ink" type="button" @click="goBackToDish">返回评论区</button>
          </div>
        </form>
      </div>

      <aside class="review-note">
        <p class="handwrite">评分标签规则</p>
        <ul>
          <li>4.5 以上：必吃</li>
          <li>4.0 以上：推荐</li>
          <li>3.0 以上：再议</li>
          <li>3.0 以下：踩雷</li>
        </ul>
      </aside>
    </article>
  </section>
</template>

<script setup>
/**
 * ReviewCreateView
 * 职责：承接菜品详情页的点评入口，完成星级评分和文字评论提交。
 * 作者：XXXXX
 * 创建时间：2026-05-09
 * 使用场景：用户从某个菜品评论区进入 03 点评页面后提交点评。
 * 依赖：Pinia、Vue Router、useDishStore、useCanteenStore、useAuthStore。
 * 设计说明：当前阶段点评写入前端 store，提交后回到对应菜品评论区。
 */
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ReviewTargetPicker from '../../components/review/ReviewTargetPicker.vue';
import StarRatingInput from '../../components/review/StarRatingInput.vue';
import { useAuthStore } from '../../store/useAuthStore';
import { useCanteenStore } from '../../store/useCanteenStore';
import { useDishStore } from '../../store/useDishStore';

defineOptions({
  name: 'ReviewCreateView',
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const canteenStore = useCanteenStore();
const dishStore = useDishStore();
const message = ref('');
const form = reactive({
  rating: 0,
  comment: '',
});
const target = reactive({
  canteenId: '',
  stallName: '',
  dishId: '',
});

const canteenId = computed(() => target.canteenId);
const dishId = computed(() => target.dishId);
const canteens = computed(() => canteenStore.canteens);
const canteen = computed(() => canteenStore.getCanteenById(canteenId.value));
const dish = computed(() => {
  const target = dishStore.getDishById(dishId.value);
  if (!target || target.canteenId !== canteenId.value) {
    return null;
  }
  return target;
});
const stallOptions = computed(() => {
  if (!target.canteenId) return [];

  const stalls = dishStore.dishes
    .filter(item => item.canteenId === target.canteenId)
    .map(item => item.stall ?? item.valueNote)
    .filter(Boolean);

  return [...new Set(stalls)];
});
const dishOptions = computed(() => {
  if (!target.canteenId || !target.stallName) return [];

  return dishStore.dishes.filter(
    item =>
      item.canteenId === target.canteenId &&
      (item.stall ?? item.valueNote) === target.stallName
  );
});

watch(
  () => [route.query.canteenId, route.query.dishId],
  ([nextCanteenId, nextDishId]) => {
    const nextDish = dishStore.getDishById(String(nextDishId ?? ''));
    if (!nextDish || nextDish.canteenId !== String(nextCanteenId ?? '')) {
      return;
    }

    target.canteenId = nextDish.canteenId;
    target.stallName = nextDish.stall ?? nextDish.valueNote ?? '';
    target.dishId = nextDish.id;
  },
  { immediate: true }
);

function handleCanteenChange(nextCanteenId) {
  target.canteenId = nextCanteenId;
  target.stallName = '';
  target.dishId = '';
  message.value = '';
}

function handleStallChange(nextStallName) {
  target.stallName = nextStallName;
  target.dishId = '';
  message.value = '';
}

function handleDishChange(nextDishId) {
  target.dishId = nextDishId;
  message.value = '';
}

function goBackToDish() {
  if (!dish.value || !canteen.value) {
    router.push({ name: 'homeCanteenSelect' });
    return;
  }

  router.push({
    name: 'dishDetail',
    params: {
      canteenId: canteenId.value,
      dishId: dishId.value,
    },
  });
}

/**
 * 校验点评表单并写入菜品点评状态。
 * @returns {void}
 */
function handleSubmit() {
  if (!dish.value || !canteen.value) {
    message.value = '请先选择要点评的餐厅、档口和菜品。';
    return;
  }

  if (!form.rating) {
    message.value = '请点击星星选择评分。';
    return;
  }

  if (!form.comment) {
    message.value = '请填写文字评论。';
    return;
  }

  dishStore.createDishReview({
    dishId: dishId.value,
    rating: form.rating,
    comment: form.comment,
    reviewer: authStore.displayName,
  });

  goBackToDish();
}
</script>

<style scoped lang="scss">
.review-view {
  min-width: 0;
}

.review-paper {
  border: 1px solid var(--ft-color-secondary);
  background: var(--zine-paper-card);
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 22px;
  padding: clamp(20px, 4vw, 40px);
}

.review-paper__main h1 {
  margin: 16px 0 0;
  font-family: var(--zine-title-font);
  font-size: clamp(48px, 7vw, 86px);
  line-height: 0.9;
}

.review-paper__lead {
  margin: 16px 0 0;
  color: var(--zine-stamp-red);
  font-size: 28px;
}

.review-target { margin-top: 18px; border: 1px dashed var(--ft-color-secondary); background: rgb(255 250 240 / 68%); padding: 14px; }
.review-target p { margin: 10px 0 0; color: var(--ft-color-secondary-soft); }

.review-form {
  margin-top: 24px;
  display: grid;
  gap: 14px;
}

.review-form label {
  display: grid;
  gap: 6px;
  color: var(--ft-color-text-muted);
  font-size: 14px;
}

.review-form input,
.review-form textarea {
  width: 100%;
  border: 1px solid var(--ft-color-secondary);
  background: #fffaf0;
  color: var(--ft-color-secondary);
  font: inherit;
  padding: 12px 14px;
  outline: none;
}

.review-form textarea { resize: vertical; }

.review-form__message { margin: 0; color: var(--zine-stamp-red); }

.review-form__actions { display: flex; flex-wrap: wrap; gap: 12px; }

.review-note {
  align-self: start;
  border: 1px dashed var(--ft-color-secondary);
  background: var(--zine-paper-card-alt);
  padding: 18px;
  transform: rotate(1.4deg);
}

.review-note p {
  margin: 0;
  color: var(--zine-stamp-red);
  font-size: 26px;
}

.review-note ul {
  margin: 12px 0 0;
  padding-left: 20px;
  color: var(--ft-color-secondary-soft);
}

@media (max-width: 860px) {
  .review-paper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .review-paper {
    padding: 18px;
  }

  .review-paper__main h1 {
    font-size: clamp(40px, 13vw, 54px);
  }

  .review-paper__lead,
  .review-note p {
    font-size: 22px;
  }

  .review-form__actions {
    display: grid;
    grid-template-columns: 1fr;
  }

  .review-note {
    transform: none;
  }
}
</style>
