# 智策云·科创企业融资智能体

## 项目概述

"智策云·科创企业融资智能体"是一个基于AI的科创企业融资服务平台，通过整合企业三件套（水母报告、企业征信、个人征信）和公开大数据，由NFS-Agent（净融资空间计算智能体）产出可落地的资产配置与融资方案。

## 核心功能

1. **企业信息管理** - 录入和管理科创企业基本信息
2. **三件套数据解析** - 自动提取水母报告、企业征信、个人征信数据
3. **大数据风控分析** - 基于公开数据的企业风险评估
4. **NFS智能计算** - 净融资空间计算，筛选R≥25%资产
5. **报告生成** - 自动生成融资方案报告
6. **线下服务工单** - 对接线下金融服务工单系统

## 技术栈

### 前端
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- ESLint + Prettier

### 后端
- Node.js + Express
- TypeScript
- Prisma ORM (PostgreSQL)
- Jest (单元测试)
- ESLint + Prettier

### 共享
- 共享类型定义
- 统一的数据模型

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 后端启动
```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 文件配置数据库连接
npx prisma generate
npm run dev
```

## 项目结构

```
zhi-ce-yun/
├── frontend/           # Next.js 前端项目
├── backend/            # Node.js 后端项目
│   ├── src/
│   │   ├── routes/     # API路由
│   │   ├── controllers # 控制器
│   │   ├── services/   # 业务逻辑
│   │   ├── middleware/ # 中间件
│   │   ├── utils/      # 工具函数
│   │   ├── types/      # 类型定义
│   │   └── config/     # 配置文件
│   ├── prisma/         # 数据库Schema
│   └── tests/          # 测试文件
├── shared/             # 共享类型定义
├── database/           # 数据库迁移脚本
├── docs/               # 项目文档
├── scripts/            # 构建脚本
└── docker/             # Docker配置
```

## 许可证

MIT License
