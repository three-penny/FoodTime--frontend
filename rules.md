# FoodTime Frontend Rules

本文档定义 `FoodTime-frontend` 的前端开发规范，目标是统一技术选型、目录组织、编码风格、测试策略和交付质量门禁，确保所有成员在提交代码前都能通过自动化检查。

## 1. 技术栈基线

### 1.1 运行时与包管理

- Node.js: `20 LTS` 或以上
- npm: `10.x`，统一使用 `npm`，禁止混用 `pnpm`、`yarn`
- 包锁文件: 必须提交 `package-lock.json`

### 1.2 核心框架与库版本

- Vue: `^3.5.x`
- Vite: `^5.x`
- JavaScript: `ES2022`
- Vue Router: `^4.x`
- Pinia: `^2.x`
- Axios: `^1.x`
- Element Plus: `^2.x`

### 1.3 质量工具

- ESLint: `^9.x`
- Prettier: `^3.x`
- Vitest: `^2.x`
- @vue/test-utils: `^2.x`
- Playwright: `^1.5x`
- Husky: `^9.x`
- lint-staged: `^15.x`

### 1.4 必须遵守的原则

- 项目以 `Vue 3 + Vite + JavaScript` 为唯一前端基础栈。
- 新增能力优先复用现有库，不得随意引入重复功能依赖。
- 所有依赖升级需附带变更说明，重大版本升级必须经评审。

## 2. 目录结构约定

推荐目录结构如下：

```text
src/
├── api/                    # 接口层，仅负责 HTTP 调用与响应适配
├── assets/                 # 图片、图标、字体、全局样式变量
├── components/             # 通用组件
├── composables/            # 组合式逻辑，统一 useXxx 命名
├── constants/              # 常量定义
├── layouts/                # 页面布局
├── router/                 # 路由配置与导航守卫
├── store/                  # Pinia 状态管理
├── utils/                  # 纯函数工具，不得依赖 DOM
├── views/                  # 页面级组件
├── App.vue                 # 根组件
└── main.js                 # 应用入口
```

当前仓库尚未全部创建上述目录，但后续新增目录时必须遵守本规范。

### 2.1 目录职责

- `api/`: 不写页面逻辑，只负责请求定义、请求实例、响应转换。
- `components/`: 放可复用组件，不放具体页面业务耦合逻辑。
- `views/`: 每个页面一个主入口，允许组合 `components/`。
- `store/`: 仅管理全局状态、会话态、跨页面共享业务状态。
- `router/`: 统一维护静态路由、动态路由、路由守卫。
- `utils/`: 必须保持纯函数优先，避免副作用。
- `assets/`: 统一存放静态文件与样式资源，不允许散落在页面目录。

## 3. 命名规范

### 3.1 文件与目录命名

- 目录名: `kebab-case`，如 `user-center`
- Vue 通用组件文件: `PascalCase.vue`，如 `OrderCard.vue`
- 页面组件文件: `PascalCase` + `View.vue`，如 `OrderListView.vue`
- 组合式函数: `useXxx.js`，如 `useAuth.js`
- Pinia Store: `useXxxStore.js`，如 `useCartStore.js`
- 接口模块: `xxx.api.js`，如 `order.api.js`
- 工具函数文件: `camelCase.js` 或按领域命名，如 `formatTime.js`

### 3.2 组件命名

- 基础组件统一前缀 `Base`，如 `BaseButton.vue`
- 业务组件使用业务域前缀，如 `OrderTable.vue`、`UserProfileCard.vue`
- 单文件组件内 `defineOptions({ name: 'XxxYyy' })` 时名称与文件名保持一致

### 3.3 路由命名

- 路由路径使用 `kebab-case`，如 `/order-detail`
- 路由 `name` 使用 `camelCase`，如 `orderDetail`
- 一级业务页面必须具备独立路由名，禁止匿名路由
- 需要鉴权的路由必须显式声明 `meta.requiresAuth = true`

## 4. 代码风格

### 4.1 JavaScript 与 Vue 代码要求

- 一律使用 `const` / `let`，禁止 `var`
- 字符串默认使用单引号
- 语句末尾保留分号
- 缩进统一为 2 个空格
- 优先使用组合式 API
- 单个组件文件建议不超过 `300` 行，超过需拆分
- 单个函数建议不超过 `80` 行，复杂函数必须拆分
- 禁止在模板中编写复杂表达式，复杂逻辑移入 `computed` 或方法

### 4.2 ESLint 约束

最低要求：

- 启用 `eslint:recommended`
- 启用 `plugin:vue/vue3-recommended`
- 启用 `eslint-config-prettier`
- 开启未使用变量检查
- 开启 `eqeqeq`
- 开启 `no-console`，仅开发环境允许 `console.warn` 与 `console.error`

建议 `.eslintrc.cjs` 示例：

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    eqeqeq: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'vue/multi-word-component-names': 'off',
  },
};
```

### 4.3 Prettier 约束

建议 `.prettierrc` 示例：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

### 4.4 Git 提交信息格式

统一使用 Conventional Commits：

```text
feat: 新增订单列表页面
fix: 修复登录状态丢失问题
refactor: 拆分订单卡片组件
docs: 更新前端开发规范
test: 补充购物车 store 单测
chore: 升级 eslint 与 vitest
```

禁止提交：

- `update`
- `modify`
- `fix bug`
- `临时提交`

## 5. 样式管理规范

### 5.1 样式方案

- 默认使用 `SCSS` 作为 CSS 预处理器
- 全局样式、变量、mixins 放在 `src/assets/styles/`
- 组件样式优先使用 `<style scoped lang="scss">`
- Element Plus 主题变量统一在全局主题文件中维护

### 5.2 命名约定

- 业务样式使用 `BEM`：`block__element--modifier`
- 通用工具类允许以 `u-` 前缀命名，如 `u-text-ellipsis`
- 状态类使用 `is-` 前缀，如 `is-active`
- JS 钩子类使用 `js-` 前缀，禁止用于样式控制

### 5.3 样式限制

- 禁止直接写行内样式，动态样式除外
- 禁止页面间复制粘贴大段样式，需提取为公共类或组件
- 所有颜色、间距、圆角、阴影优先使用设计令牌变量

样式示例：

```vue
<template>
  <section class="order-card" :class="{ 'is-active': active }">
    <h3 class="order-card__title">{{ title }}</h3>
    <p class="order-card__desc u-text-ellipsis">{{ description }}</p>
  </section>
</template>

<style scoped lang="scss">
.order-card {
  padding: 16px;
  border-radius: 12px;

  &__title {
    font-size: 16px;
    font-weight: 600;
  }

  &__desc {
    color: #666;
  }

  &.is-active {
    border: 1px solid #409eff;
  }
}
</style>
```

## 6. 接口调用规范

### 6.1 统一封装要求

- 所有接口必须经由 `src/api/` 统一封装
- 禁止在 `views/`、`components/` 中直接写 `axios.create()` 或直接请求裸 URL
- 必须统一设置 `baseURL`、超时时间、请求头、鉴权头、错误拦截器

### 6.2 响应与错误处理

- 统一在响应拦截器中处理业务错误码
- 401: 跳转登录页并清理本地凭证
- 403: 提示权限不足
- 5xx: 弹出统一错误提示并上报监控
- 网络超时: 提示用户重试，不得吞错

### 6.3 环境变量管理

- 所有环境变量必须使用 `VITE_` 前缀
- 不允许把接口域名、密钥、开关常量硬编码在业务代码中
- 建议维护 `.env.development`、`.env.test`、`.env.production`

变量示例：

```bash
VITE_APP_TITLE=FoodTime
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MOCK=false
```

Axios 封装示例：

```js
// src/api/http.js
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

http.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => response.data,
  error => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default http;
```

接口模块示例：

```js
// src/api/order.api.js
import http from './http';

export function getOrderList(params) {
  return http.get('/api/v1/orders', { params });
}
```

## 7. 性能优化要求

### 7.1 构建与代码分割

- 路由页面必须使用懒加载
- 体积较大的第三方库必须评估按需加载
- 公共模块抽离为独立 chunk
- 禁止把所有页面逻辑集中在单一入口文件

路由懒加载示例：

```js
const OrderListView = () => import('../views/OrderListView.vue');

export default [
  {
    path: '/orders',
    name: 'orderList',
    component: OrderListView,
    meta: { requiresAuth: true },
  },
];
```

### 7.2 静态资源要求

- 图片优先使用 `WebP` / `AVIF`
- 单张位图默认不超过 `300 KB`
- 首页首屏图片默认不超过 `150 KB`
- SVG 图标优先使用精简后的矢量资源

### 7.3 页面性能指标

- 首屏 JS gzip 体积目标: `< 250 KB`
- 页面首次可交互时间目标: `< 3 s`
- 核心页面接口并发请求数默认不超过 `5`

## 8. 测试策略

### 8.1 单元测试

- 组件、工具函数、store、接口适配层必须具备单元测试
- 推荐使用 `Vitest + @vue/test-utils`
- 覆盖率阈值：
  - lines: `>= 80%`
  - statements: `>= 80%`
  - functions: `>= 80%`
  - branches: `>= 70%`

### 8.2 E2E 测试

- 核心业务链路必须具备 E2E 用例
- 推荐使用 `Playwright`
- 至少覆盖：
  - 登录与登出
  - 首页访问
  - 核心下单流程
  - 关键异常提示流程

### 8.3 测试文件命名

- 单元测试: `*.test.js`
- 组件测试: `*.spec.js`
- E2E 测试: `*.e2e.spec.js`

## 9. CI/CD 质量门禁

CI 在合并前必须执行并全部通过：

1. 依赖安装成功
2. ESLint 无错误
3. Prettier 检查通过
4. 单元测试通过且覆盖率达标
5. E2E 冒烟测试通过
6. `vite build` 成功
7. 打包产物体积未超阈值
8. Lighthouse 评分达标

门禁阈值建议：

- 构建耗时: `<= 120 s`
- 单入口 JS gzip: `<= 250 KB`
- 单张图片资源: `<= 300 KB`
- Lighthouse Performance: `>= 90`
- Lighthouse Accessibility: `>= 95`
- Lighthouse Best Practices: `>= 95`
- Lighthouse SEO: `>= 90`

## 10. 可执行校验脚本

建议在 `package.json` 中维护如下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .js,.vue --max-warnings 0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test:unit": "vitest run --coverage",
    "test:e2e": "playwright test",
    "analyze": "vite build --mode production",
    "check": "npm run lint && npm run format:check && npm run test:unit && npm run build"
  }
}
```

## 11. 提交前自动化检查

推荐使用 `husky + lint-staged`。

`lint-staged` 示例：

```json
{
  "*.{js,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,scss,css}": [
    "prettier --write"
  ]
}
```

`.husky/pre-commit` 示例：

```bash
#!/usr/bin/env sh
npx lint-staged
npm run test:unit
```

提交前本地最少执行：

```bash
npm run lint
npm run format:check
npm run test:unit
npm run build
```

## 12. 参考代码片段

页面组件示例：

```vue
<script setup>
import { onMounted, ref } from 'vue';
import { getOrderList } from '../api/order.api';

const loading = ref(false);
const orders = ref([]);

async function fetchOrders() {
  loading.value = true;
  try {
    orders.value = await getOrderList();
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOrders);
</script>

<template>
  <section class="order-list-view">
    <h1 class="order-list-view__title">订单列表</h1>
    <div v-if="loading">加载中...</div>
    <ul v-else>
      <li v-for="item in orders" :key="item.id">{{ item.name }}</li>
    </ul>
  </section>
</template>
```

## 13. 项目架构规范

本章节用于补充前端工程在软件架构层面的统一要求，目标是保证 `FoodTime-frontend` 在长期迭代中保持高内聚、低耦合、可测试、可部署、可观测。

### 13.1 分层架构设计原则

- 前端必须遵循“页面层、组件层、状态层、接口层、基础设施层”分层设计。
- `views/` 负责页面编排，不直接承载复杂数据转换与重复业务逻辑。
- `components/` 负责 UI 复用与局部交互，不直接依赖具体页面场景。
- `store/` 负责跨页面共享状态、会话态和缓存态，禁止把所有局部状态塞入全局 store。
- `api/` 负责请求实例、接口定义、响应转换与统一异常处理，禁止页面直接拼接 URL。
- `utils/`、`composables/`、`constants/` 归属基础设施或公共能力层，必须保持复用性。

推荐逻辑分层：

```text
View -> Component -> Composable / Store -> API -> Backend Service
```

### 13.2 模块划分规范

- 按业务域优先划分模块，如 `auth`、`order`、`menu`、`user`。
- 一个业务域至少应包含页面、接口、状态与复用组件的边界定义。
- 通用能力必须沉淀到公共目录，禁止在多个业务目录复制相同实现。
- 单个模块内部文件数量超过 `10` 个时，应继续拆分子目录。
- 页面模块命名需体现业务含义，不得使用 `test1`、`demoPage` 之类临时命名。

建议结构：

```text
src/
├── api/
│   ├── auth.api.js
│   ├── order.api.js
│   └── http.js
├── store/
│   ├── useAuthStore.js
│   └── useOrderStore.js
├── views/
│   ├── auth/
│   └── order/
└── components/
    ├── base/
    └── business/
```

### 13.3 依赖管理规则

- 新增依赖前必须评估是否与现有能力重复。
- UI 组件、请求库、状态管理库原则上保持单一选型，不得同时引入同类替代库。
- 大体积依赖必须评估按需加载、Tree Shaking 与包体积影响。
- 运行时依赖放在 `dependencies`，仅构建、测试、校验相关依赖放在 `devDependencies`。
- 禁止在业务代码中直接依赖未在 `package.json` 明确声明的隐式依赖。

### 13.4 接口定义标准

- 接口定义统一放入 `src/api/`，命名采用 `xxx.api.js`。
- 每个接口方法必须具备明确的输入、输出、错误处理约定。
- 页面或组件调用接口时必须通过 API 模块，不得直接发起裸请求。
- 接口返回数据若需转换，应在 API 层或适配层完成，而不是散落到多个页面。
- 分页、排序、筛选参数命名必须统一，例如 `page`、`page_size`、`sort_by`、`order`。

### 13.5 配置管理规范

- 环境配置必须来自 `.env.*`，统一使用 `VITE_` 前缀。
- 配置按环境分层维护：`development`、`test`、`production`。
- 功能开关、API 地址、埋点开关等必须集中管理，不得硬编码在页面中。
- 涉及安全或敏感逻辑的值不得以内嵌常量方式暴露在前端。
- 建议增加 `src/constants/config.js` 作为前端运行时配置出口。

### 13.6 数据模型与状态设计准则

- 页面临时状态优先使用组件局部状态。
- 跨页面共享、需缓存或鉴权相关状态才进入 Pinia。
- Store 中的数据结构应尽量贴近业务模型，避免深层嵌套导致难维护。
- 所有列表数据必须定义明确的空态、加载态、错误态。
- 禁止将未经标准化的后端原始响应直接暴露给多个页面复用。

### 13.7 安全性架构要求

- Token、会话信息、用户敏感标识必须由统一鉴权模块管理。
- 前端不得保存明文密码、私钥、服务端密钥。
- 用户输入必须在前端进行基础校验，但安全性最终以后端校验为准。
- 对富文本、HTML 片段、外链内容必须做 XSS 风险控制。
- 涉及支付、账号、隐私等页面必须评估防重复提交、操作确认与权限校验链路。

### 13.8 性能优化指导原则

- 路由页面默认懒加载。
- 大型业务模块按路由、业务域或功能分块拆包。
- 列表页必须考虑分页、虚拟滚动或懒渲染策略。
- 首屏只加载首屏必需资源，非关键资源延后加载。
- 图片、字体、图标资源必须纳入体积控制策略。
- 对高频渲染组件要避免无意义响应式依赖和重复计算。

### 13.9 可扩展性设计规范

- 新功能应优先以模块扩展方式接入，不得破坏既有目录职责。
- 跨业务复用逻辑优先提炼为 `composables/` 或基础组件。
- 路由、菜单、权限、配置等系统能力优先采用声明式配置。
- 接口适配层应保留字段兼容能力，减少后端字段变动对页面的直接影响。
- 需要接入新端能力时，优先新增模块，不在旧模块中堆叠条件分支。

### 13.10 可维护性标准

- 每个模块需具备稳定边界与单一职责。
- 单文件过大、逻辑过深、重复代码过多时必须重构。
- 公共代码必须有示例、注释或 README 支撑理解。
- 所有关键行为都应可测试，避免不可替换、不可注入的硬编码逻辑。
- 关键流程必须预留日志、埋点或错误上报能力。

### 13.11 可测试、可部署、可监控要求

- 所有 API 访问必须可 Mock，便于单元与集成测试。
- 构建输出必须稳定，可在 CI 环境中无交互完成。
- 必须支持按环境注入不同配置，禁止构建后再手工改产物。
- 前端错误必须接入统一监控入口，记录页面、路由、用户操作上下文。
- 核心业务页面应埋点关键转化行为与失败事件，便于定位问题。

## 14. 类与方法注释规范

本章节用于统一前端代码注释与文档标准，重点覆盖组件、类、组合式函数、工具方法、Store 与 API 模块的注释要求。

### 14.1 注释总体原则

- 注释必须解释“为什么这样设计”而不仅是“代码做了什么”。
- 注释必须与代码同步更新，代码变更后注释未同步视为缺陷。
- 对自解释代码不强制重复注释，但公共接口、复杂逻辑、关键边界必须有注释。
- 新增公共模块、复杂函数、基础组件时必须补充文档注释。

### 14.2 类注释必须包含的内容

适用于类、Store、组件主模块、复杂组合式封装：

- 模块/类职责描述
- 作者或维护团队标识
- 创建时间
- 使用场景
- 外部依赖关系
- 输入输出边界
- 是否采用特定设计模式
- 重要限制与注意事项

推荐模板：

```js
/**
 * OrderListStore
 * 职责：管理订单列表的分页查询、筛选状态与缓存刷新。
 * 作者：FoodTime Frontend Team
 * 创建时间：2026-04-17
 * 使用场景：订单列表页、订单概览卡片复用数据源。
 * 依赖：Pinia、order.api.js
 * 设计说明：采用 store + API 适配分层，避免页面直接处理请求细节。
 * 注意事项：仅存放跨页面共享状态，临时筛选弹窗状态不应进入该 store。
 */
export class OrderListStore {}
```

### 14.3 方法注释必须涵盖的要素

适用于公共函数、组合式函数、API 方法、Store action、复杂计算方法：

- 方法功能描述
- 参数说明
- 返回值说明
- 可能抛出的异常或失败场景
- 使用示例
- 算法复杂度或性能说明
- 是否涉及副作用
- 线程安全性或并发注意事项

推荐模板：

```js
/**
 * 获取订单列表。
 * @param {Object} params 查询参数
 * @param {number} params.page 当前页码
 * @param {number} params.page_size 每页数量
 * @returns {Promise<Object>} 返回订单分页结果
 * @throws {Error} 当网络异常或接口返回失败时抛出错误
 * @example
 * const result = await getOrderList({ page: 1, page_size: 20 });
 * @description 该方法会发起 HTTP 请求，属于有副作用方法。
 * @performance 建议避免在短时间内重复触发，必要时在调用方做防抖。
 */
export function getOrderList(params) {
  return http.get('/api/v1/orders', { params });
}
```

### 14.4 Vue 组件注释要求

- 页面组件必须在文件头说明页面职责、权限要求、依赖接口。
- 复杂业务组件必须说明输入 `props`、输出 `emits` 和关键交互流程。
- 组件中若存在非常规渲染策略、缓存策略或性能优化技巧，必须注明原因。

推荐示例：

```vue
<script setup>
/**
 * OrderListView
 * 职责：展示订单分页列表，并提供筛选、刷新、跳转详情等能力。
 * 使用场景：订单管理主页面。
 * 依赖：Pinia、Vue Router、order.api.js。
 * 注意：页面初始化会自动拉取第一页数据。
 */
</script>
```

### 14.5 注释格式标准

- JavaScript 文档注释统一使用 `/** ... */`
- JSDoc 标签至少使用：`@param`、`@returns`、`@throws`、`@example`
- 对公共 API、公共组件、公共 composable 强制使用文档注释
- 行内注释使用 `//`，仅用于解释临时性、边界性或反直觉逻辑
- 禁止使用无意义注释，如“给变量赋值”“循环数组”

### 14.6 强制注释范围

以下内容必须写文档注释：

- `src/api/` 中所有导出方法
- `store/` 中所有导出 Store
- `composables/` 中所有导出函数
- 公共组件与基础组件
- 超过 `30` 行的复杂函数
- 含性能优化、缓存、节流、防抖、懒加载等特殊逻辑的方法

### 14.7 注释同步更新机制

- 修改公共方法签名时，必须同步更新 `@param`、`@returns`
- 修改组件职责或交互链路时，必须同步更新组件头部注释
- 删除异常抛出逻辑后，必须移除过期 `@throws`
- PR 评审时需检查“注释是否仍然描述当前实现”

### 14.8 注释质量检查规则

- 注释不得与实现明显冲突
- 注释不得复制函数名本身作为描述
- 注释必须能帮助新人快速理解模块职责和调用方式
- 对关键模块至少包含一个 `@example`
- 复杂逻辑若无注释说明设计原因，视为不合格

### 14.9 自动化验证流程

- ESLint 可接入 `eslint-plugin-jsdoc` 检查公共函数注释完整性
- CI 需在 `lint` 阶段校验 JSDoc 规范
- 对公共 API、Store、Composable 可增加脚本扫描导出函数是否存在文档注释
- Code Review 阶段必须人工检查注释的准确性，而不仅是“是否存在”

建议脚本：

```json
{
  "scripts": {
    "lint:comments": "eslint src --ext .js,.vue",
    "check:docs": "npm run lint:comments && npm run lint && npm run test:unit"
  }
}
```

## 15. 执行要求

- 新增页面、组件、接口模块前先检查是否符合命名与分层规范
- 所有提交必须通过本地 `check` 命令
- 所有合并请求必须附带测试结果、影响范围和必要截图
- 违反本规范的代码在 Code Review 阶段应直接退回修改
