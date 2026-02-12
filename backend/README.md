# 智策云智能体系统 - 后端 API

智策云智能体系统的后端 API 服务，提供企业征信、NFS 计算、资产管理等功能。

## 功能特性

- 🔐 **认证模块** - 用户注册、登录、JWT 令牌管理
- 🏢 **企业管理** - 企业信息管理、搜索
- 📊 **征信模块** - 企业征信数据解析
- 💰 **资产管理** - 资产检索、批量导入
- 🧮 **NFS 计算** - 批量 NFS 信用评估（核心功能）
- 📄 **报告生成** - 多类型报告生成与下载
- 🎫 **工单系统** - 任务管理与跟踪

## 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- npm 或 yarn

### 安装

```bash
# 进入项目目录
cd zhi-ce-yun/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库连接等信息

# 初始化数据库
npx prisma generate
npx prisma migrate dev --name init

# 启动开发服务器
npm run dev
```

### 环境变量

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/zhi_ce_yun?schema=public"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# 服务器配置
PORT=3000
NODE_ENV=development

# 文件上传
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760
```

### 可用脚本

```bash
# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start

# Prisma 操作
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:migrate   # 运行数据库迁移
npm run prisma:studio    # 打开 Prisma Studio
```

## API 文档

完整 API 文档请查看 [API.md](API.md)

## 项目结构

```
backend/
├── prisma/
│   └── schema.prisma      # 数据库模型定义
├── src/
│   ├── controllers/       # 控制器层 - 处理 HTTP 请求
│   ├── services/          # 服务层 - 业务逻辑实现
│   ├── routes/            # 路由定义
│   ├── middlewares/       # 中间件
│   │   ├── auth.middleware.ts      # JWT 认证
│   │   ├── error.middleware.ts     # 错误处理
│   │   └── validate.middleware.ts  # 请求验证
│   ├── core/             # 核心工具类
│   │   ├── response.ts           # 统一响应格式
│   │   └── error.ts             # 错误处理
│   ├── lib/              # 库配置
│   │   └── prisma.ts            # Prisma 客户端
│   └── index.ts          # 应用入口
├── API.md                # API 文档
├── package.json
├── tsconfig.json
└── .env.example
```

## 技术栈

- **运行时**: Node.js
- **语言**: TypeScript
- **Web 框架**: Express.js
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **认证**: JWT (jsonwebtoken)
- **验证**: express-validator
- **密码加密**: bcryptjs

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 async/await 处理异步操作

### 分层架构

```
Request → Route → Controller → Service → Database
                   ↓
              Middleware
```

### 错误处理

- 使用 `AppError` 类处理业务错误
- 中间件统一处理错误响应
- 区分生产环境和开发环境错误显示

## 许可证

MIT
