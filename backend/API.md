# 智策云智能体系统 - 后端 API 文档

## 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **版本**: v1
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

## 统一响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 分页响应

```json
{
  "code": 200,
  "message": "Success",
  "data": [...],
  "timestamp": "2026-02-11T23:18:00.000Z",
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "Validation error message",
  "data": null,
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

---

## 1. 认证模块

### 1.1 用户注册

**POST** `/api/v1/auth/register`

**请求体:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "用户名"
}
```

**响应 (201):**

```json
{
  "code": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用户名",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 1.2 用户登录

**POST** `/api/v1/auth/login`

**请求体:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**响应 (200):**

```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用户名",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 1.3 用户登出

**POST** `/api/v1/auth/logout`

**请求头:** `Authorization: Bearer <access_token>`

**响应 (200):**

```json
{
  "code": 200,
  "message": "Logout successful",
  "data": null,
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 1.4 刷新令牌

**POST** `/api/v1/auth/refresh-tokens`

**请求体:**

```json
{
  "refreshToken": "eyJ..."
}
```

### 1.5 获取当前用户

**GET** `/api/v1/auth/me`

**请求头:** `Authorization: Bearer <access_token>`

---

## 2. 企业与征信模块

### 2.1 解析企业征信

**POST** `/api/v1/credit/enterprise/parse`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "enterpriseData": {
    "name": "示例企业",
    "creditCode": "91110000...",
    "legalPerson": "张三",
    "registeredCapital": "1000万",
    "establishmentDate": "2020-01-01",
    "address": "北京市朝阳区",
    "businessScope": "技术开发..."
  },
  "reportData": {
    "companyName": "示例企业",
    "creditCode": "91110000...",
    "taxRating": "A",
    "creditRating": "AA",
    "riskLevel": "LOW",
    "revenue": 50000000,
    "profit": 5000000,
    "assets": 20000000
  }
}
```

**响应 (201):**

```json
{
  "code": 201,
  "message": "Credit report parsed successfully",
  "data": {
    "id": "uuid",
    "enterpriseId": "uuid",
    "status": "COMPLETED",
    "parsedData": {
      "summary": { ... },
      "riskIndicators": { ... },
      "financialHighlights": { ... }
    },
    "createdAt": "2026-02-11T23:18:00.000Z"
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 2.2 获取企业详情

**GET** `/api/v1/enterprises/{id}`

**请求头:** `Authorization: Bearer <access_token>`

**响应 (200):**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "name": "示例企业",
    "creditCode": "91110000...",
    "legalPerson": "张三",
    "registeredCapital": "1000万",
    "establishmentDate": "2020-01-01T00:00:00.000Z",
    "address": "北京市朝阳区",
    "businessScope": "技术开发...",
    "status": "存续",
    "createdAt": "2026-02-11T23:18:00.000Z",
    "updatedAt": "2026-02-11T23:18:00.000Z",
    "creditReports": [...],
    "assets": [...],
    "nfsCalculations": [...]
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

### 2.3 搜索企业

**GET** `/api/v1/enterprises/search`

**请求头:** `Authorization: Bearer <access_token>`

**查询参数:**
- `name` - 企业名称（模糊搜索）
- `creditCode` - 统一社会信用代码
- `legalPerson` - 法定代表人
- `page` - 页码（默认1）
- `pageSize` - 每页数量（默认20）

**响应 (200):**

```json
{
  "code": 200,
  "message": "Success",
  "data": [...],
  "timestamp": "2026-02-11T23:18:00.000Z",
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 3. 资产模块

### 3.1 资产检索

**POST** `/api/v1/assets/search`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "enterpriseId": "uuid",
  "type": "REAL_ESTATE",
  "status": "ACTIVE",
  "name": "写字楼",
  "minValue": 1000000,
  "maxValue": 10000000,
  "page": 1,
  "pageSize": 20
}
```

**支持的资产类型:**
- `REAL_ESTATE` - 不动产
- `VEHICLE` - 车辆
- `EQUIPMENT` - 设备
- `INTANGIBLE` - 无形资产
- `FINANCIAL` - 金融资产
- `OTHER` - 其他

### 3.2 获取资产详情

**GET** `/api/v1/assets/{id}`

**请求头:** `Authorization: Bearer <access_token>`

### 3.3 批量导入资产

**POST** `/api/v1/assets/import`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "assets": [
    {
      "enterpriseId": "uuid",
      "name": "某写字楼",
      "type": "REAL_ESTATE",
      "value": 5000000,
      "location": "北京市海淀区",
      "description": "建筑面积500平米"
    },
    {
      "name": "某车辆",
      "type": "VEHICLE",
      "value": 300000,
      "location": "北京市朝阳区"
    }
  ]
}
```

**响应 (200):**

```json
{
  "code": 200,
  "message": "Imported 2 assets, 0 failed",
  "data": {
    "success": 2,
    "failed": 0,
    "errors": []
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

---

## 4. NFS 计算模块（核心）

### 4.1 批量计算 NFS

**POST** `/api/v1/nfs/calculate-batch`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "calculations": [
    {
      "enterpriseId": "uuid-1",
      "financialData": {
        "revenue": 50000000,
        "profit": 5000000,
        "assets": 20000000,
        "liabilities": 8000000,
        "equity": 12000000,
        "cashFlow": 6000000
      },
      "creditData": {
        "creditScore": 750,
        "riskLevel": "LOW",
        "defaultHistory": false,
        "latePayments": 0
      },
      "assetData": {
        "totalAssets": 25000000,
        "collateralValue": 20000000,
        "liquidityRatio": 1.8
      }
    },
    {
      "enterpriseId": "uuid-2",
      "financialData": {
        "revenue": 30000000,
        "profit": 2000000,
        "assets": 15000000,
        "liabilities": 10000000,
        "equity": 5000000,
        "cashFlow": 1000000
      }
    }
  ]
}
```

**响应 (200):**

```json
{
  "code": 200,
  "message": "NFS calculation completed",
  "data": [
    {
      "id": "uuid-1-calculation",
      "enterpriseId": "uuid-1",
      "score": 82.5,
      "riskLevel": "LOW",
      "nfsGrade": "AA",
      "factors": {
        "financialScore": 85,
        "creditScore": 80,
        "assetScore": 82
      },
      "recommendation": "企业财务状况良好，信用记录良好，建议批准贷款",
      "createdAt": "2026-02-11T23:18:00.000Z"
    },
    {
      "id": "uuid-2-calculation",
      "enterpriseId": "uuid-2",
      "score": 65.3,
      "riskLevel": "MEDIUM",
      "nfsGrade": "BBB",
      "factors": {
        "financialScore": 68,
        "creditScore": 62,
        "assetScore": 65
      },
      "recommendation": "企业财务状况一般，建议在提供抵押或担保的情况下批准贷款",
      "createdAt": "2026-02-11T23:18:00.000Z"
    }
  ],
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

**NFS 评分说明:**
- **评分范围**: 0-100
- **等级划分**:
  - `AAA`: ≥90 (极低风险)
  - `AA`: 80-89 (低风险)
  - `A`: 70-79 (较低风险)
  - `BBB`: 60-69 (一般风险)
  - `BB`: 50-59 (较高风险)
  - `B`: 40-49 (高风险)
  - `CCC`: 30-39 (很高风险)
  - `D`: <30 (极高风险)

---

## 5. 报告模块

### 5.1 生成报告

**POST** `/api/v1/report/generate`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "type": "COMPREHENSIVE",
  "title": "企业综合评估报告 - 2026年2月",
  "enterpriseId": "uuid",
  "parameters": {
    "includeCredit": true,
    "includeAssets": true,
    "includeNfs": true,
    "limit": 10
  }
}
```

**报告类型:**
- `CREDIT` - 征信报告
- `ASSET` - 资产报告
- `NFS` - NFS 计算报告
- `COMPREHENSIVE` - 综合评估报告

### 5.2 获取报告详情

**GET** `/api/v1/reports/{id}`

**请求头:** `Authorization: Bearer <access_token>`

### 5.3 下载报告

**GET** `/api/v1/reports/{id}/download`

**请求头:** `Authorization: Bearer <access_token>`

**响应**: 返回文件下载

---

## 6. 工单模块

### 6.1 创建工单

**POST** `/api/v1/workorders/create`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "type": "NFS_CALCULATION",
  "title": "请求批量 NFS 计算",
  "description": "需要对以下10家企业进行 NFS 评估",
  "priority": "HIGH",
  "enterpriseId": "uuid"
}
```

**工单类型:**
- `CREDIT_QUERY` - 征信查询
- `ASSET_SEARCH` - 资产搜索
- `NFS_CALCULATION` - NFS 计算
- `REPORT_GENERATION` - 报告生成
- `TECHNICAL_SUPPORT` - 技术支持
- `OTHER` - 其他

### 6.2 获取工单列表

**GET** `/api/v1/workorders`

**请求头:** `Authorization: Bearer <access_token>`

**查询参数:**
- `status` - 状态筛选
- `type` - 类型筛选
- `page` - 页码
- `pageSize` - 每页数量

**工单状态:**
- `OPEN` - 待处理
- `IN_PROGRESS` - 处理中
- `PENDING_CUSTOMER` - 等待客户
- `RESOLVED` - 已解决
- `CLOSED` - 已关闭

### 6.3 更新工单状态

**PUT** `/api/v1/workorders/{id}/status`

**请求头:** `Authorization: Bearer <access_token>`

**请求体:**

```json
{
  "status": "IN_PROGRESS"
}
```

**响应 (200):**

```json
{
  "code": 200,
  "message": "WorkOrder status updated",
  "data": {
    "id": "uuid",
    "status": "IN_PROGRESS",
    "updatedAt": "2026-02-11T23:18:00.000Z"
  },
  "timestamp": "2026-02-11T23:18:00.000Z"
}
```

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如邮箱已注册） |
| 500 | 服务器内部错误 |

---

## 快速开始

### 1. 安装依赖

```bash
cd zhi-ce-yun/backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件
```

### 3. 初始化数据库

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. 启动开发服务器

```bash
npm run dev
```

### 5. 运行测试

```bash
npm test
```

---

## 项目结构

```
backend/
├── prisma/
│   └── schema.prisma      # 数据库模型
├── src/
│   ├── controllers/       # 控制器层
│   │   ├── auth.controller.ts
│   │   ├── enterprise.controller.ts
│   │   ├── credit.controller.ts
│   │   ├── asset.controller.ts
│   │   ├── nfs.controller.ts
│   │   ├── report.controller.ts
│   │   └── workorder.controller.ts
│   ├── services/          # 服务层（业务逻辑）
│   │   ├── auth.service.ts
│   │   ├── enterprise.service.ts
│   │   ├── credit.service.ts
│   │   ├── asset.service.ts
│   │   ├── nfs.service.ts
│   │   ├── report.service.ts
│   │   └── workorder.service.ts
│   ├── routes/            # API 路由
│   │   ├── auth.routes.ts
│   │   ├── enterprise.routes.ts
│   │   ├── asset.routes.ts
│   │   ├── nfs.routes.ts
│   │   ├── report.routes.ts
│   │   └── workorder.routes.ts
│   ├── middlewares/       # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── core/             # 核心工具
│   │   ├── response.ts
│   │   └── error.ts
│   ├── lib/              # 库配置
│   │   └── prisma.ts
│   └── index.ts          # 应用入口
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 技术栈

- **运行时**: Node.js + TypeScript
- **框架**: Express.js
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **认证**: JWT (jsonwebtoken)
- **验证**: express-validator
- **密码加密**: bcryptjs
