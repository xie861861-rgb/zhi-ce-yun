# 数据库设计文档

## 概述

本项目使用 PostgreSQL 数据库，通过 Prisma ORM 进行数据访问层的管理。

## 数据库配置

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zhi_ce_yun?schema=public"
```

## 数据模型

### User (用户)

| 字段 | 类型 | 描述 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | PK, Default(uuid()) |
| email | String | 邮箱 | Unique, Not Null |
| password | String | 密码(加密) | Not Null |
| name | String | 用户名 | Nullable |
| role | Role | 角色 | Default(USER) |
| createdAt | DateTime | 创建时间 | Default(now()) |
| updatedAt | DateTime | 更新时间 | Auto |

#### Role枚举
- USER: 普通用户
- ADMIN: 管理员
- ANALYST: 分析师

### Company (企业)

| 字段 | 类型 | 描述 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | PK |
| name | String | 企业名称 | Not Null |
| unifiedSocialCreditCode | String | 统一社会信用代码 | Unique |
| registrationCapital | Float | 注册资本 | Nullable |
| paidInCapital | Float | 实缴资本 | Nullable |
| establishmentDate | DateTime | 成立日期 | Nullable |
| legalRepresentative | String | 法定代表人 | Nullable |
| address | String | 地址 | Nullable |
| businessScope | String | 经营范围 | Nullable |
| industry | String | 所属行业 | Nullable |
| annualRevenue | Float | 年营收 | Nullable |
| totalAssets | Float | 总资产 | Nullable |
| totalLiabilities | Float | 总负债 | Nullable |
| netAssets | Float | 净资产 | Nullable |
| creditScore | Int | 信用评分(0-100) | Nullable |
| riskLevel | String | 风险等级 | Nullable |
| userId | UUID | 所属用户ID | FK |
| createdAt | DateTime | 创建时间 | Default |
| updatedAt | DateTime | 更新时间 | Auto |

### FinancialData (财务数据)

| 字段 | 类型 | 描述 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | PK |
| companyId | UUID | 企业ID | FK |
| year | Int | 数据年份 | Not Null |
| quarter | Int | 季度(1-4) | Nullable |
| revenue | Float | 营收 | Nullable |
| profit | Float | 利润 | Nullable |
| assets | Float | 资产 | Nullable |
| liabilities | Float | 负债 | Nullable |
| createdAt | DateTime | 创建时间 | Default |

### Report (报告)

| 字段 | 类型 | 描述 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | PK |
| title | String | 报告标题 | Not Null |
| type | ReportType | 报告类型 | Not Null |
| status | ReportStatus | 状态 | Default(PENDING) |
| content | JSON | 报告内容 | Nullable |
| netFinancingSpace | Float | 净融资空间 | Nullable |
| recommendedAssets | JSON | 推荐资产配置 | Nullable |
| companyId | UUID | 企业ID | FK |
| userId | UUID | 用户ID | FK |
| createdAt | DateTime | 创建时间 | Default |
| updatedAt | DateTime | 更新时间 | Auto |

#### ReportType枚举
- CREDIT: 信用评估报告
- NFS: 净融资空间报告
- ASSET_CONFIG: 资产配置报告
- RISK_ANALYSIS: 风险分析报告

#### ReportStatus枚举
- PENDING: 待处理
- PROCESSING: 处理中
- COMPLETED: 已完成
- FAILED: 失败

### ServiceOrder (服务工单)

| 字段 | 类型 | 描述 | 约束 |
|------|------|------|------|
| id | UUID | 主键 | PK |
| type | ServiceType | 工单类型 | Not Null |
| status | OrderStatus | 状态 | Default(PENDING) |
| description | String | 描述 | Not Null |
| companyName | String | 企业名称 | Not Null |
| contactName | String | 联系人 | Not Null |
| contactPhone | String | 联系电话 | Not Null |
| userId | UUID | 用户ID | FK |
| createdAt | DateTime | 创建时间 | Default |
| updatedAt | DateTime | 更新时间 | Auto |

#### ServiceType枚举
- CONSULTATION: 咨询服务
- FINANCING: 融资服务
- ASSET_MANAGEMENT: 资产管理
- OTHER: 其他

#### OrderStatus枚举
- PENDING: 待处理
- IN_PROGRESS: 进行中
- COMPLETED: 已完成
- CANCELLED: 已取消

## 索引设计

### Company表索引
- `idx_company_user`: (userId)
- `idx_company_industry`: (industry)
- `idx_company_credit_score`: (creditScore)

### FinancialData表索引
- `idx_financial_company`: (companyId)
- `idx_financial_year`: (year, quarter)

### Report表索引
- `idx_report_company`: (companyId)
- `idx_report_user`: (userId)
- `idx_report_type`: (type)
- `idx_report_status`: (status)

### ServiceOrder表索引
- `idx_service_order_user`: (userId)
- `idx_service_order_status`: (status)
- `idx_service_order_type`: (type)

## ER图

```
┌─────────────────────────────────────────────────────────────────┐
│                           User                                  │
├─────────────────────────────────────────────────────────────────┤
│ id: UUID [PK]                                                  │
│ email: String [UK]                                             │
│ password: String                                                │
│ name: String                                                    │
│ role: Role                                                      │
└─────────────────────────────────────────────────────────────────┘
     │                                                           │
     │ 1                                                        │ N
     ▼                                                           ▼
┌─────────────┐                                            ┌─────────────┐
│   Company   │◀───────────────────────────────────────────│   Report    │
├─────────────┤                                            ├─────────────┤
│ id: UUID    │                                            │ id: UUID    │
│ name: String│ N                                          │ title: String│
│ ...         │                                            │ type: ReportType│
│ userId: UUID│────────────────────────────────────────────│ status: ReportStatus│
└─────────────┘                                            │ companyId: UUID [FK]│
     │                                                     │ userId: UUID [FK] │
     │ 1                                                   └─────────────┘
     ▼                                                           │
┌─────────────────┐                                              │
│ FinancialData   │                                              │
├─────────────────┤                                              │
│ id: UUID        │                                              │
│ companyId: UUID │                                              │
│ year: Int       │                                              │
│ revenue: Float   │                                              │
│ profit: Float   │                                              │
└─────────────────┘                                              │
                                                                   
┌─────────────────────────────────────────────────────────────────┐
│                       ServiceOrder                               │
├─────────────────────────────────────────────────────────────────┤
│ id: UUID                                                        │
│ type: ServiceType                                               │
│ status: OrderStatus                                             │
│ description: String                                             │
│ companyName: String                                             │
│ contactName: String                                             │
│ contactPhone: String                                            │
│ userId: UUID [FK]                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 初始化命令

```bash
# 生成Prisma客户端
npx prisma generate

# 创建数据库迁移
npx prisma migrate dev --name init

# 打开Prisma Studio (可视化数据管理)
npx prisma studio
```

## 备份与恢复

```bash
# 备份
pg_dump -U postgres -d zhi_ce_yun > backup.sql

# 恢复
psql -U postgres -d zhi_ce_yun < backup.sql
```
