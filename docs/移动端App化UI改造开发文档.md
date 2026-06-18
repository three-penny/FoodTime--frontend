作者：Codex
创建时间：2026-06-18
适用项目：`FoodTime-frontend`

## 1. 文档目的

本文档记录 FoodTime 前端移动端 App 化 UI 改造的开发背景、改造范围、关键文件、设计规则、验证结果和后续维护注意事项，方便后续继续优化手机端体验。

本次改造只处理前端布局、样式和少量交互状态，不修改业务接口、不新增路由、不调整后端请求。

## 2. 项目背景

项目技术栈：

+ Vue 3
+ JavaScript
+ Vite
+ Vue Router
+ Pinia
+ Element Plus
+ SCSS
+ Vitest

核心入口与样式文件：

```text
src/App.vue
src/assets/styles/tokens.scss
src/assets/styles/global.scss
src/components/layout/AppHeader.vue
```

改造前主要问题：

+ 手机端顶部导航仍承担桌面端职责，占用空间大。
+ 原横向导航和首页轮播在手机端滑动不顺畅。
+ 多处标题使用过大的 `vw` 字号，窄屏下容易挤压。
+ 卡片、印章、贴纸、旋转装饰在手机端容易造成文字重叠。
+ 详情页、表单页和后台页面按钮排列不适合触控。
+ 后台表格在手机端可读性弱，缺少横向滚动提示。

## 3. 设计目标

+ 桌面端继续保留“食堂手账 / zine”风格。
+ 手机端改成更接近 App 的使用方式：顶部轻量、底部主导航、页面信息分层清楚。
+ 优先保证无横向页面溢出、无文字重叠、按钮易点击、轮播滑动稳定。
+ 降低移动端重投影、旋转、贴纸和自动滚动带来的视觉干扰。
+ 保持现有色彩系统，不引入新的强烈主题色。

## 4. 分阶段提交

本次按小步提交完成，每个阶段独立提交。

```text
15b3581 样式：添加移动端布局基础
247e986 功能：将手机端顶部导航替换为底部标签栏
4a5ce65 样式：优化首页移动端体验
681fda6 样式：优化移动端详情页和表单布局
de156f6 样式：优化移动端后台和个人页面
```

说明：提交哈希在执行提交信息改写后会变化，以上为最初开发阶段对应关系，后续以 `git log --oneline` 为准。

## 5. 主要改造内容

### 5.1 全局移动端基础

涉及文件：

```text
src/App.vue
src/assets/styles/tokens.scss
src/assets/styles/global.scss
```

改造内容：

+ 增加移动端页面宽度、底部导航预留和安全区变量。
+ 收紧移动端页面内边距，统一使用更稳定的 `12px / 16px / 20px` 间距节奏。
+ 降低移动端装饰密度，减少滚动时的视觉抖动。
+ 调整 `.section-title`、`.stamp`、`.sticker`、`.button-ink` 等通用组件在手机端的字号、换行和触控尺寸。

### 5.2 手机端导航

涉及文件：

```text
src/components/layout/AppHeader.vue
src/components/layout/AppHeader.spec.js
```

改造内容：

+ 手机端顶部只保留紧凑品牌和账号入口。
+ 主功能入口改为底部 Tab，复用现有导航数据和路由目标。
+ 移除手机端横向滚动导航作为主入口，减少卡顿和顶部空间占用。
+ 保持认证页不显示底部 Tab。
+ 保留重复点击推荐入口时派发首页滚动事件的行为。

### 5.3 首页移动端体验

涉及文件：

```text
src/views/home/HomeView.vue
src/components/home/HomeHero.vue
src/components/home/TodayRecommendationCarousel.vue
src/components/home/CanteenCarousel.vue
src/components/home/HomeRankingList.vue
src/components/home/CanteenIntroGrid.vue
src/composables/useAutoHorizontalScroll.js
src/composables/useAutoHorizontalScroll.spec.js
```

改造内容：

+ 首页 Hero 在手机端改为紧凑欢迎区，不再占据大块首屏高度。
+ 今日推荐和食堂轮播在触摸设备上暂停自动横向滚动，避免和手势拖拽冲突。
+ 轮播卡片在手机端使用稳定宽度，去掉负 margin 和明显旋转。
+ 排行榜和食堂介绍在手机端改为更接近列表式信息卡。
+ 补充自动横滚暂停相关单测。

### 5.4 详情页与表单页

涉及文件：

```text
src/views/canteen/CanteenDetailView.vue
src/views/dish/DishListView.vue
src/views/dish/DishDetailView.vue
src/components/canteen/CanteenStallCard.vue
src/components/dish/DishCard.vue
src/views/review/ReviewCreateView.vue
src/components/review/StarRatingInput.vue
src/views/submission/DishUploadView.vue
src/views/rant/RantWallView.vue
```

改造内容：

+ 手机端图片统一使用 `aspect-ratio` 控制比例，减少固定高度导致的挤压。
+ 大标题控制在约 `34px - 44px`。
+ 表单输入字号保持 `16px`，避免移动浏览器聚焦时自动放大。
+ 操作按钮在手机端改为单列或双列网格，提升触控稳定性。
+ 弹窗在窄屏下增加内边距和最大高度，防止内容贴边或溢出。
+ 减少菜品卡、档口卡在手机端的旋转装饰。

### 5.5 个人中心、消息、投稿与后台兜底

涉及文件：

```text
src/views/profile/ProfileView.vue
src/views/message/MessageCenterView.vue
src/views/submission/UserSubmissionView.vue
src/views/admin/AdminAuditView.vue
src/views/admin/AdminManageView.vue
src/views/superadmin/SuperadminView.vue
```

改造内容：

+ 个人中心手机端顶部标识、头像印章和 Tab 区域更紧凑。
+ 邀请码、编辑资料、快捷入口按钮在手机端改为单列。
+ 消息卡片去掉手机端胶带装饰和旋转，降低遮挡风险。
+ 投稿记录图片使用固定比例展示，状态统计改为单列。
+ 审核台筛选区取消移动端 sticky，审核卡按钮改为单列。
+ 内容管理页 Tabs 改为三等分 App 风格。
+ 超级管理员表格保留横向滚动，并增加“左右滑动查看完整表格”提示。
+ 超级管理员弹窗在手机端改为可滚动单列布局。

## 6. 测试与验证

执行过的主要命令：

```bash
npm.cmd run build
npm.cmd run test:unit
npm.cmd run test:unit -- src/components/layout/AppHeader.spec.js src/views/home/HomeView.spec.js
npm.cmd run test:unit -- src/composables/useAutoHorizontalScroll.spec.js src/composables/useDragScroll.spec.js src/components/home/CanteenCarousel.spec.js src/components/home/TodayRecommendationCarousel.spec.js src/components/home/HomeHero.spec.js src/views/home/HomeView.spec.js
```

验证结论：

+ `npm.cmd run build` 通过。
+ 导航阶段和首页阶段定向测试通过。
+ 登录页在 `390x844` 浏览器视口下无横向溢出。
+ 认证页不会显示底部 Tab。

已知测试失败：

+ `src/store/usePointsStore.spec.js`：测试期望 `consumePoints` 同步返回 `true`，当前实际返回 Promise。
+ `src/store/useSubmissionStore.spec.js`：审核操作测试触发网络请求，状态断言仍为 `pending`。
+ `src/components/canteen/CanteenStallCard.spec.js`：测试挂载组件时缺少 active Pinia。
+ `src/views/profile/ProfileView.spec.js`：受积分消费记录问题影响，找不到“兑换食堂优惠券”。
+ `src/views/review/ReviewCreateView.spec.js`：点评 store 断言与当前数据流不一致。

这些失败不是本次移动端样式改造新增的问题，后续若要修复，应单独处理 store 异步行为、API mock 和 Pinia 测试挂载。

## 7. 后续维护建议

+ 后续新增页面时，先检查 `520px` 以下断点，避免再使用过大的 `vw` 标题。
+ 触控按钮最小高度建议保持 `44px` 左右。
+ 移动端表单输入建议保持 `16px` 字号。
+ 手机端尽量减少旋转、负 margin、绝对定位贴纸和重投影。
+ 后台表格如果无法重构为卡片列表，至少保留明确的横向滚动容器和提示。
+ 新增导航入口时同时检查 `AppHeader.vue` 的桌面导航和移动端底部 Tab。
+ 行为变化应补充 Vitest；纯样式变化至少执行 `npm.cmd run build`。

## 8. 本地运行

常用命令：

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run test:unit
```

如果开发服务器使用默认端口，访问地址通常为：

```text
http://127.0.0.1:5173/
```
