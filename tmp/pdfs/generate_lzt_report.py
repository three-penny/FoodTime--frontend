from pathlib import Path
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path.cwd()
OUT_DIR = ROOT / "output" / "pdf"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MD_PATH = OUT_DIR / "lzt编码实现报告.md"
PDF_PATH = OUT_DIR / "lzt编码实现报告.pdf"
PROMPT_425_PATH = Path(r"C:\Users\asus\Desktop\【4.25】开发.md")
PROMPT_426_PATH = Path(r"C:\Users\asus\Desktop\【4.26】杂志风开发.md")


def read_prompt(path):
    if path.exists():
        return path.read_text(encoding="utf-8").strip()
    return f"未找到原始 Prompt 文档：{path}"


REPORT_MD = """# lzt编码实现报告

作者：刘智童（lzt）  
项目：FoodTime-frontend  
生成依据：华为云需求截图、`前端任务一开发交接文档.md`、`前端任务一技术设计文档.md`、`【4.25】开发.md`、`【4.26】杂志风开发.md`、仓库 Git 记录  
生成时间：2026-06-20

## 3 编码实现报告

### 3.1 项目简介、Prompt 与 Vibe Coding 过程

#### 3.1.1 项目简介

FoodTime 是一个面向校园食堂场景的 B/S 架构前端项目，主要服务于学生查看食堂、档口、菜品与评价信息的日常使用链路。本人负责前端任务一与手机端显示相关工作，核心范围包括：首页 / 食堂选择页面、食堂详情页、菜品列表页、档口卡片、菜品详情页、菜品卡片展示，以及后续移动端 App 化 UI 适配。

前端技术栈沿用项目现有方案：Vue 3、JavaScript、Vite、Vue Router、Pinia、Axios、Element Plus、SCSS 与 Vitest。实现上采用“路由页面 + 业务组件 + Store + Mock/API 数据”的分层方式，页面通过 `src/router/index.js` 管理入口，通过 `src/store/useCanteenStore.js`、`src/store/useDishStore.js` 等 Store 管理食堂与菜品数据。

与本人任务相关的主要文件包括：

| 类型 | 文件 |
| --- | --- |
| 页面 | `src/views/home/HomeView.vue`、`src/views/canteen/CanteenDetailView.vue`、`src/views/dish/DishListView.vue`、`src/views/dish/DishDetailView.vue` |
| 首页组件 | `src/components/home/HomeHero.vue`、`TodayRecommendationCarousel.vue`、`CanteenCarousel.vue`、`CanteenIntroGrid.vue`、`HomeRankingList.vue` |
| 食堂与菜品组件 | `src/components/canteen/CanteenStallCard.vue`、`src/components/dish/DishCard.vue`、`src/components/dish/DishReviewPanel.vue` |
| 移动端与布局 | `src/App.vue`、`src/components/layout/AppHeader.vue`、`src/assets/styles/global.scss`、`src/assets/styles/tokens.scss` |
| 测试 | `src/components/layout/AppHeader.spec.js`、`src/composables/useAutoHorizontalScroll.spec.js`、首页与卡片相关 spec 文件 |

从 Git 记录看，前端任务一经历了从首版页面、Mock 数据、杂志风视觉、食堂详情页、前后端数据链路到推荐 API 对接的迭代；手机端显示任务在 `feature/optimize-mobile-web` 分支中完成，提交包括移动端基础布局、底部 Tab 导航、首页移动端体验、详情页与表单页适配、后台与个人中心移动端兜底等。

#### 3.1.2 Prompt 参考

以下 Prompt 中，4.25 与 4.26 开发 Prompt 直接来自本人原始开发文档，按原文完整放入报告；移动端显示任务没有保存完整聊天原文，因此按 `docs/移动端App化UI改造开发文档.md` 和 Git 记录模拟整理。

#### 3.1.2.1 4.25 初始开发 Prompt 原文

__PROMPT_425__

#### 3.1.2.2 4.26 杂志风开发 Prompt 原文

__PROMPT_426__

#### 3.1.2.3 移动端显示任务 Prompt（模拟整理）

```txt
这是一个 Vue3 + Vite + Pinia + Vue Router + Element Plus + SCSS 的 FoodTime 前端项目。
我负责前端任务一和手机端显示相关任务。现在请你在不修改业务接口、不新增路由、不调整后端请求的前提下，对当前前端做“手机端 App 化 UI 改造”。

动手前请先阅读并遵守：
1. 项目根目录 rules.md；
2. package.json；
3. src/router/index.js；
4. src/App.vue；
5. src/assets/styles/tokens.scss；
6. src/assets/styles/global.scss；
7. src/components/layout/AppHeader.vue；
8. docs/前端任务一开发交接文档.md。

请先输出你准备修改的文件清单和计划，不要胡编不存在的路径或配置。

【总体目标】
桌面端继续保留“校园美食手帐 / zine”风格；手机端改成更接近 App 的使用方式。
重点不是重做业务，而是让手机端浏览首页、食堂、菜品、点评、投稿、个人中心和后台页面时：
- 不出现横向页面溢出；
- 不出现文字重叠、按钮遮挡和贴纸盖住正文；
- 主导航更适合拇指操作；
- 表单输入和按钮适合触控；
- 页面层级清楚，卡片、列表、表格都能在窄屏下阅读；
- 行为变化尽量补单元测试。

【改造范围】

1. 全局移动端基础
涉及文件：
- src/App.vue
- src/assets/styles/tokens.scss
- src/assets/styles/global.scss

要求：
- 增加移动端页面宽度、底部导航预留和 safe-area 支持；
- 在 520px 以下收紧页面 padding，建议使用 12px / 16px / 20px 的间距节奏；
- 禁止继续使用会导致窄屏挤压的大号 vw 字号；
- .section-title、.stamp、.sticker、.button-ink 等全局类在手机端要能换行、缩小并保持可读；
- 降低移动端重投影、旋转、负 margin、绝对定位贴纸的强度；
- 页面不能出现 body 级横向滚动。

2. 手机端导航
涉及文件：
- src/components/layout/AppHeader.vue
- src/components/layout/AppHeader.spec.js

要求：
- 桌面端保留当前顶部导航；
- 手机端顶部只保留紧凑品牌和账号入口；
- 手机端主入口改为底部 Tab 栏，复用已有导航数据和路由目标；
- 底部 Tab 至少覆盖首页、食堂 / 推荐、点评、消息、我的等已有入口；
- 认证页、登录页、注册页不显示底部 Tab；
- 保留“重复点击推荐入口时触发首页推荐区滚动”的原有行为；
- 给底部 Tab 渲染、认证页隐藏、重复点击推荐事件补充单元测试。

3. 首页移动端体验
涉及文件：
- src/views/home/HomeView.vue
- src/components/home/HomeHero.vue
- src/components/home/TodayRecommendationCarousel.vue
- src/components/home/CanteenCarousel.vue
- src/components/home/HomeRankingList.vue
- src/components/home/CanteenIntroGrid.vue
- src/composables/useAutoHorizontalScroll.js
- src/composables/useAutoHorizontalScroll.spec.js

要求：
- 首页 Hero 在手机端改为紧凑欢迎区，不要占据过高首屏；
- 今日推荐卡片和食堂选择卡片在手机端使用稳定宽度，不要负 margin，不要明显旋转；
- 手机端触摸设备上暂停自动横向滚动，避免和手势滑动冲突；
- 横向滚动区域保留自然手势滑动，但隐藏滚动条；
- 热榜图片和名次在手机端不要互相挤压，序号、图片、文字层级清楚；
- 食堂介绍在手机端改为更接近列表式信息卡；
- 首页所有模块在 390x844 视口下不能横向溢出。

4. 详情页和表单页移动端
涉及文件：
- src/views/canteen/CanteenDetailView.vue
- src/views/dish/DishListView.vue
- src/views/dish/DishDetailView.vue
- src/components/canteen/CanteenStallCard.vue
- src/components/dish/DishCard.vue
- src/views/review/ReviewCreateView.vue
- src/components/review/StarRatingInput.vue
- src/views/submission/DishUploadView.vue
- src/views/rant/RantWallView.vue

要求：
- 图片统一用 aspect-ratio 控制比例，避免固定高度在窄屏下挤压；
- 大标题在手机端控制在 34px 到 44px 左右；
- 表单输入字号保持 16px，避免移动浏览器聚焦时自动放大；
- 操作按钮在手机端改为单列或双列网格；
- 星级评分、上传表单、点评输入框不应超出父容器；
- 弹窗在窄屏下增加内边距和最大高度，内容可滚动；
- 菜品卡、档口卡在手机端减少旋转和装饰遮挡。

5. 个人中心、消息、投稿和后台兜底
涉及文件：
- src/views/profile/ProfileView.vue
- src/views/message/MessageCenterView.vue
- src/views/submission/UserSubmissionView.vue
- src/views/admin/AdminAuditView.vue
- src/views/admin/AdminManageView.vue
- src/views/superadmin/SuperadminView.vue

要求：
- 个人中心手机端头像、昵称、统计信息、Tab 区域更紧凑；
- 邀请码、编辑资料、快捷入口按钮在手机端改为单列；
- 消息卡片去掉手机端容易遮挡内容的胶带装饰和旋转；
- 投稿记录图片使用固定比例，状态统计在手机端改为单列；
- 审核台筛选区取消移动端 sticky，审核卡按钮改为单列；
- 内容管理页 Tabs 改成三等分 App 风格；
- 超级管理员表格保留横向滚动容器，并增加“左右滑动查看完整表格”的提示；
- 超级管理员弹窗在手机端改为可滚动单列布局。

【测试与验证】
请在修改完成后执行：
- npm.cmd run build
- npm.cmd run test:unit -- src/components/layout/AppHeader.spec.js src/views/home/HomeView.spec.js
- npm.cmd run test:unit -- src/composables/useAutoHorizontalScroll.spec.js src/composables/useDragScroll.spec.js src/components/home/CanteenCarousel.spec.js src/components/home/TodayRecommendationCarousel.spec.js src/components/home/HomeHero.spec.js src/views/home/HomeView.spec.js

如果全量 npm.cmd run test:unit 有历史遗留失败，请说明失败项是否与本次移动端样式改造有关，不要把无关失败伪装成本次通过。

【验收标准】
- 390x844 手机视口下首页无横向溢出；
- 登录页和注册页不显示底部 Tab；
- 手机端主导航固定在底部，点击后路由正常；
- 重复点击“推荐”仍能触发首页推荐区滚动；
- 今日推荐、食堂选择、热榜卡片不重叠；
- 详情页图片、表单、按钮在手机端不挤压；
- 后台表格可以横向滑动查看；
- build 通过，新增或受影响的行为测试通过。

请严格保持改动范围：只处理前端布局、样式和少量交互状态，不要改业务接口、不要新增真实后端字段、不要写入密钥或敏感信息。
```

#### 3.1.3 Vibe Coding 过程

- 先让 AI Agent 阅读 `rules.md`、`package.json`、`src/router`、`src/views`、`src/components`、`src/store`，让它先总结项目结构和可新增页面，而不是直接生成代码。
- 根据华为云中本人负责的 IR，拆分为首页推荐、食堂选择、食堂详情、全部档口与档口卡片、菜品详情几条前端链路。
- 初稿阶段让 AI 生成首页、食堂详情、菜品列表、菜品详情与卡片组件，用 Mock 数据先保证页面可运行。
- 视觉迭代阶段，通过 4.25/4.26 的 Prompt 逐步把通用商业 UI 调整为“校园打饭日记 / Zine 杂志风”，重点修正卡片比例、栏目编号、纸张纹理、手写批注、印章评分等细节。
- 数据链路阶段，根据 Git 记录逐步完成首页食堂选择到食堂档案、全部档口、推荐 API 的对接，减少页面直接依赖 Mock 数据。
- 手机端阶段，将 AI 初步生成的响应式方案继续压实：收紧全局间距，替换为底部 Tab，取消移动端过强旋转与贴纸装饰，处理首页轮播触摸冲突，并给 `AppHeader` 与自动横向滚动补充测试。
- 每一轮生成后先人工阅读 diff，确认没有改动无关模块、没有硬编码敏感信息、没有引入不存在的路径或配置，再运行构建或定向测试。

#### 3.1.4 AI 生成后的人工修改与存在问题

AI 生成后的主要人工修改：

- 将“看起来像 demo 的首页”调整为真实项目结构：拆分 `HomeHero`、`TodayRecommendationCarousel`、`CanteenCarousel`、`CanteenIntroGrid`、`HomeRankingList` 等组件，避免所有逻辑堆在首页文件中。
- 将首页食堂入口与路由行为修正为稳定链路：食堂卡片可以进入食堂详情或对应菜品列表，详情页和列表页能处理无效 `canteenId` 与空档口状态。
- 对推荐与排行榜数据做字段适配：从前端本地筛选逐步改为读取后端推荐 API，并在展示层补齐图片、评价短句、排名、标签等前端展示字段。
- 对 zine 风 UI 做人工筛选：减少 AI 容易生成的过度卡片化、大圆角、同质化阴影，保留纸张、贴纸、印章和栏目编号等与项目一致的视觉语言。
- 对移动端做二次压缩和兜底：底部导航替代顶部横向导航，首页卡片尺寸变稳定，详情页图片使用 `aspect-ratio`，后台表格保留横向滚动提示。
- 对行为变化补充测试：`AppHeader.spec.js` 覆盖移动端底部 Tab 与认证页隐藏逻辑；`useAutoHorizontalScroll.spec.js` 覆盖触摸设备暂停自动滚动逻辑。

开发中遇到的问题：

- 初期 AI 生成的视觉较偏“通用 food app”，与校园食堂和 zine 风格不完全匹配，需要通过更具体的风格 Prompt 多轮收敛。
- Mock 数据与后端接口字段存在差异，例如价格、评分、食堂 / 档口层级字段需要在 Store 或页面中做适配。
- 图片资源体积偏大，部分 JPG/PNG 会影响构建产物和移动端加载，后续仍建议继续压缩为 WebP。
- 移动端中贴纸、旋转、负 margin 和大字号容易导致重叠或横向溢出，因此后续改为更克制的 App 化布局。
- 移动端文档记录中仍存在部分非本次样式改造引入的测试失败，例如积分 Store 异步返回、投稿审核 API mock、部分组件缺少 active Pinia 等，需要后续单独修复。

#### 3.1.5 Git 记录依据

与前端任务一直接相关的提交记录包括：

| Commit | 说明 |
| --- | --- |
| `c031be6` | 从空白实现北交干饭吧全站首版 |
| `6bc5351` | 实现首页 / 食堂 / 菜品四页并接入本地 Mock 数据 |
| `5e0d078` | 排行榜改为前十并增加评分、价格、评价等展示 |
| `7a51cf4` | 实现杂志风背景装饰与真实食物图片替换 |
| `3ceef72` | 优化首页样式 |
| `16749d2` | 开发食堂详情页 |
| `dedae55` | 打通首页食堂选择到全部档口的前后端数据链路 |
| `817009a` | 首页今日推荐 / 本周热榜改为对接后端推荐 API |

与手机端显示相关的提交记录包括：

| Commit | 说明 |
| --- | --- |
| `caf2db2` | 添加移动端布局基础 |
| `b7a18e4` | 将手机端顶部导航替换为底部标签栏 |
| `f91fe32` | 优化首页移动端体验 |
| `142e3ab` | 优化移动端详情页和表单布局 |
| `8f92f66` | 优化移动端后台和个人页面 |
| `c1808ea` | 压缩首页移动端卡片和分隔间距 |
| `43774d3` | 调整移动端热榜序号和图片位置 |

### 3.2 功能来源映射

本节只列本人负责的华为云需求与手机端显示任务。华为云截图中未显示具体编号，因此下表使用报告内编号 `IR-HW-*` 标记，需求名称保持与截图一致；`US-MOBILE-*` 为根据手机端显示任务整理的用户故事。

| 系统功能 | 来源 IR / US | 需求要点 | 前端实现位置 | 说明 |
| --- | --- | --- | --- | --- |
| 首页今日推荐卡片展示 | `IR-HW-01 首页推荐信息展示` | 学生进入首页后先看到推荐菜品，卡片包含菜名、图片、评分、食堂名、档口名、价格和学生评价短句 | `HomeView.vue`、`TodayRecommendationCarousel.vue`、`useDishStore.js` / `useCanteenStore.js` | 后续提交中改为对接 `GET /recommendations/daily` |
| 首页本周热榜 / 排行榜展示 | `IR-HW-01 首页推荐信息展示` 派生 | 帮助用户快速获得有用信息，减少选择时间 | `HomeRankingList.vue`、`HomeView.vue` | 与首页推荐共同构成首页决策信息 |
| 首页食堂选择入口 | `IR-HW-02 食堂选择入口展示` | 首页展示多个食堂入口，用户点击食堂卡片后进入对应页面查看档口和菜品 | `CanteenCarousel.vue`、`CanteenIntroGrid.vue`、`router/index.js` | 对应华为云“食堂选择入口展示” |
| 食堂详情信息展示 | `IR-HW-03 食堂详情信息展示` | 展示食堂图片、名称、评分、位置、营业时间、人均价格、推荐时段等信息，并与首页信息保持一致 | `CanteenDetailView.vue`、`DishListView.vue` 顶部食堂档案 | 对应华为云“食堂详情信息展示” |
| 指定食堂的全部档口展示 | `IR-HW-04 档口列表与档口卡片展示` | 在食堂详情 / 菜品列表页展示当前食堂的档口列表 | `DishListView.vue`、`CanteenStallCard.vue`、`useCanteenStore.js` | 支持空档口状态与评分空值防御 |
| 档口卡片信息展示 | `IR-HW-04 档口列表与档口卡片展示` | 每个档口以卡片展示，包含档口图片、档口名、简介和菜品信息 | `CanteenStallCard.vue` | 移动端中减少旋转装饰，避免遮挡文字 |
| 菜品卡片与菜品详情 | `IR-HW-04 档口列表与档口卡片展示` 派生 US：查看具体菜品 | 用户可从档口继续查看具体菜品，获取菜名、图片、评分、价格、标签、评价等信息 | `DishCard.vue`、`DishDetailView.vue`、`DishReviewPanel.vue` | 属于“进一步查看具体菜品”的前端展示链路 |
| 首页推荐区定位与导航跳转 | `IR-HW-01 首页推荐信息展示`、`IR-HW-02 食堂选择入口展示` | 用户点击“美食推荐”或导航“推荐”时能定位到推荐区；点击食堂入口能进入食堂链路 | `HomeHero.vue`、`AppHeader.vue`、`HomeView.vue` | 重复点击推荐入口通过自定义事件重新触发滚动 |
| 手机端底部标签栏 | `US-MOBILE-01 手机端主导航优化` | 作为手机端用户，希望主导航固定在底部，顶部只保留轻量品牌与账号入口 | `AppHeader.vue`、`AppHeader.spec.js`、`global.scss` | 认证页隐藏底部 Tab |
| 手机端首页卡片与轮播适配 | `US-MOBILE-02 手机端首页显示优化` | 作为手机端用户，希望首页推荐、食堂选择和热榜不卡顿、不重叠、不横向溢出 | `HomeHero.vue`、`TodayRecommendationCarousel.vue`、`CanteenCarousel.vue`、`HomeRankingList.vue`、`useAutoHorizontalScroll.js` | 触摸设备暂停自动横向滚动 |
| 手机端详情页、表单页与后台兜底 | `US-MOBILE-03 手机端页面可读性优化` | 作为手机端用户，希望详情、表单、个人中心、后台页面按钮易点、表格可滑动、弹窗不溢出 | `CanteenDetailView.vue`、`DishListView.vue`、`DishDetailView.vue`、`ReviewCreateView.vue`、`DishUploadView.vue`、`AdminAuditView.vue`、`AdminManageView.vue`、`ProfileView.vue`、`SuperadminView.vue` | 主要为样式和布局优化，不改变业务接口 |

综上，本人负责的系统功能主要来源于四条华为云 IR：`首页推荐信息展示`、`食堂选择入口展示`、`食堂详情信息展示`、`档口列表与档口卡片展示`，以及后续手机端显示优化用户故事。实现时先以 Mock 数据保证页面完整，再通过 Store/API 对接真实数据，并在移动端阶段对所有相关页面做响应式兜底。
"""

REPORT_MD = REPORT_MD.replace(
    "__PROMPT_425__",
    read_prompt(PROMPT_425_PATH),
).replace(
    "__PROMPT_426__",
    read_prompt(PROMPT_426_PATH),
)


def register_fonts():
    body = "SimFang"
    bold = "SimHei"
    try:
        pdfmetrics.registerFont(TTFont(body, r"C:\Windows\Fonts\simfang.ttf"))
        pdfmetrics.registerFont(TTFont(bold, r"C:\Windows\Fonts\simhei.ttf"))
    except Exception:
        from reportlab.pdfbase.cidfonts import UnicodeCIDFont

        body = "STSong-Light"
        bold = "STSong-Light"
        pdfmetrics.registerFont(UnicodeCIDFont(body))
    return body, bold


BODY_FONT, BOLD_FONT = register_fonts()


def build_styles():
    styles = getSampleStyleSheet()
    base = ParagraphStyle(
        "cn-body",
        parent=styles["Normal"],
        fontName=BODY_FONT,
        fontSize=10.2,
        leading=17,
        textColor=colors.HexColor("#222222"),
        wordWrap="CJK",
        alignment=TA_LEFT,
        spaceAfter=5,
    )
    return {
        "title": ParagraphStyle(
            "title",
            parent=base,
            fontName=BOLD_FONT,
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1F2937"),
            spaceAfter=12,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base,
            fontName=BOLD_FONT,
            fontSize=16,
            leading=22,
            textColor=colors.HexColor("#111827"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base,
            fontName=BOLD_FONT,
            fontSize=13.5,
            leading=20,
            textColor=colors.HexColor("#B8351F"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base,
            fontName=BOLD_FONT,
            fontSize=11.6,
            leading=18,
            textColor=colors.HexColor("#374151"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": base,
        "bullet": ParagraphStyle(
            "bullet",
            parent=base,
            leftIndent=12,
            firstLineIndent=-8,
            spaceAfter=3,
        ),
        "code": ParagraphStyle(
            "code",
            parent=base,
            fontName=BODY_FONT,
            fontSize=8.8,
            leading=13.2,
            leftIndent=6,
            rightIndent=6,
            backColor=colors.HexColor("#F5F5F4"),
            borderColor=colors.HexColor("#E5E7EB"),
            borderWidth=0.4,
            borderPadding=6,
            wordWrap="CJK",
            spaceBefore=4,
            spaceAfter=8,
        ),
        "table": ParagraphStyle(
            "table",
            parent=base,
            fontSize=8.6,
            leading=12.5,
            wordWrap="CJK",
        ),
        "table_head": ParagraphStyle(
            "table-head",
            parent=base,
            fontName=BOLD_FONT,
            fontSize=8.8,
            leading=12.5,
            textColor=colors.white,
            wordWrap="CJK",
        ),
    }


STYLES = build_styles()


def para(text, style_name="body"):
    text = text.replace("`", "")
    return Paragraph(escape(text), STYLES[style_name])


def parse_table(lines):
    rows = []
    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("|"):
            continue
        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if all(set(cell) <= {"-", ":", " "} for cell in cells):
            continue
        rows.append(cells)
    if not rows:
        return None

    col_count = max(len(row) for row in rows)
    for row in rows:
        while len(row) < col_count:
            row.append("")

    page_width = A4[0] - 36 * mm
    if col_count == 2:
        col_widths = [page_width * 0.22, page_width * 0.78]
    elif col_count == 5:
        col_widths = [
            page_width * 0.15,
            page_width * 0.18,
            page_width * 0.24,
            page_width * 0.25,
            page_width * 0.18,
        ]
    else:
        col_widths = [page_width / col_count] * col_count

    table_data = []
    for row_index, row in enumerate(rows):
        style = STYLES["table_head"] if row_index == 0 else STYLES["table"]
        table_data.append([Paragraph(escape(cell.replace("`", "")), style) for cell in row])

    table = Table(table_data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#B8351F")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D1D5DB")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FFFDF7")),
            ]
        )
    )
    return table


def markdown_to_flow(markdown):
    flow = []
    lines = markdown.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            flow.append(Spacer(1, 3))
            i += 1
            continue
        if stripped.startswith("```"):
            code_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            code_text = "<br/>".join(escape(item) for item in code_lines)
            flow.append(Paragraph(code_text, STYLES["code"]))
            i += 1
            continue
        if stripped.startswith("|"):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            table = parse_table(table_lines)
            if table:
                flow.append(table)
                flow.append(Spacer(1, 6))
            continue
        if stripped.startswith("# "):
            flow.append(para(stripped[2:], "title"))
        elif stripped.startswith("## "):
            flow.append(para(stripped[3:], "h1"))
        elif stripped.startswith("### "):
            flow.append(para(stripped[4:], "h2"))
        elif stripped.startswith("#### "):
            flow.append(para(stripped[5:], "h3"))
        elif stripped.startswith("- "):
            flow.append(Paragraph("• " + escape(stripped[2:].replace("`", "")), STYLES["bullet"]))
        else:
            flow.append(para(stripped, "body"))
        i += 1
    return flow


def draw_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(BODY_FONT, 8)
    canvas.setFillColor(colors.HexColor("#6B7280"))
    canvas.drawString(18 * mm, 12 * mm, "lzt编码实现报告")
    canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, f"第 {doc.page} 页")
    canvas.restoreState()


def main():
    MD_PATH.write_text(REPORT_MD, encoding="utf-8")
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="lzt编码实现报告",
        author="lzt",
    )
    flow = markdown_to_flow(REPORT_MD)
    doc.build(flow, onFirstPage=draw_footer, onLaterPages=draw_footer)
    print(PDF_PATH)
    print(MD_PATH)


if __name__ == "__main__":
    main()
