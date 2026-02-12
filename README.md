# 智策云 - 科创企业融资智能体系统

## 项目概述

智策云是一个基于AI技术的科创企业融资智能体系统，提供企业信用评估、净融资空间计算、资产配置建议等服务。

## 技术栈

### 前端
- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **状态管理**: React Context

### 后端
- **框架**: Express.js
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **认证**: JWT

## 项目结构

```
zhi-ce-yun/
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── app/           # Next.js App Router 页面
│   │   │   ├── login/     # 登录页面
│   │   │   ├── register/  # 注册页面
│   │   │   ├── dashboard/ # 管理后台
│   │   │   │   ├── companies/  # 企业管理
│   │   │   │   ├── reports/     # 报告管理
│   │   │   │   ├── orders/      # 服务工单
│   │   │   │   └── profile/     # 个人中心
│   │   │   ├── audit/      # 智能审计页面
│   │   │   └── matching/   # 价值匹配页面
│   │   ├── components/    # React 组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── lib/           # 工具库
│   └── package.json
│
├── backend/                # 后端项目
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── services/       # 业务逻辑层
│   │   ├── routes/         # 路由定义
│   │   ├── middlewares/    # 中间件
│   │   ├── lib/           # 工具库
│   │   └── index.ts       # 应用入口
│   ├── prisma/
│   │   └── schema.prisma  # 数据库模型
│   └── package.json
│
└── database/               # 数据库相关文件
```

## 快速开始

### 1. 安装依赖

**前端:**
```bash
cd frontend
npm install
```

**后端:**
```bash
cd backend
npm install
```

### 2. 数据库设置

**生成 Prisma 客户端:**
```bash
cd backend
npx prisma generate
```

**初始化数据库:**
```bash
npx prisma db push
```

### 3. 启动服务

**后端 (端口 3001):**
```bash
cd backend
npm run dev
```

**前端 (端口 3000):**
```bash
cd frontend
npm run dev
```

### 4. 访问应用

- **前端**: http://localhost:3000
- **后端 API**: http://localhost:3001/api/v1
- **健康检查**: http://localhost:3001/api/v1/health

## API 端点

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户

### 企业管理
- `GET /api/v1/companies/search` - 搜索企业
- `GET /api/v1/companies/:id` - 获取企业详情
- `POST /api/v1/companies` - 创建企业
- `PUT /api/v1/companies/:id` - 更新企业
- `DELETE /api/v1/companies/:id` - 删除企业

### 报告管理
- `GET /api/v1/reports` - 获取报告列表
- `GET /api/v1/reports/:id` - 获取报告详情
- `POST /api/v1/reports/generate` - 生成报告
- `DELETE /api/v1/reports/:id` - 删除报告

### NFS 计算
- `POST /api/v1/nfs/calculate-batch` - 批量计算
- `GET /api/v1/nfs/calculations/:id` - 获取计算结果
- `GET /api/v1/nfs/enterprises/:id/calculations` - 获取历史记录

### 服务工单
- `GET /api/v1/service-orders` - 获取工单列表
- `POST /api/v1/service-orders` - 创建工单
- `PUT /api/v1/service-orders/:id/status` - 更新状态
- `DELETE /api/v1/service-orders/:id` - 删除工单

## 功能模块

### 1. 首页 (Landing Page)
- Hero 区域展示
- 数据指标展示
- 功能特性介绍
- 订阅表单

### 2. 登录/注册
- 用户认证
- JWT Token 管理

### 3. 管理后台
- **概览**: 数据统计、快速入口
- **企业管理**: CRUD 操作
- **报告管理**: 查看/生成报告
- **服务工单**: 创建/管理工单
- **个人中心**: 账户设置

### 4. 智能审计
- 企业信息填写
- 三件套上传 (营业执照、财务报表、征信报告)
- AI 信用评估分析

### 5. 价值匹配
- 融资需求筛选
- 智能产品推荐
- 匹配度评分

## 环境变量

### 后端 (.env)
```
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=/api/v1
```

## 构建生产版本

**前端:**
```bash
cd frontend
npm run build
npm start
```

**后端:**
```bash
cd backend
npm run build
npm start
```

## 注意事项

1. 首次运行需要先初始化数据库 (`npx prisma db push`)
2. 前端通过 Next.js rewrites 代理 API 请求到后端
3. JWT Token 存储在 localStorage 中
4. SQLite 数据库文件位于 `backend/prisma/dev.db`

## License

MIT
