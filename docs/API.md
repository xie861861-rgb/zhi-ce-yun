# API接口规范

## 基础信息

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (JWT)

## 响应格式

### 成功响应
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

## 认证接口

### 注册
```
POST /auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用户名"
    },
    "token": "jwt_token"
  }
}
```

### 登录
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "用户名",
      "role": "USER"
    },
    "token": "jwt_token"
  }
}
```

## 企业接口

### 获取企业列表
```
GET /companies
Authorization: Bearer <token>

Query Parameters:
- page: number (default: 1)
- pageSize: number (default: 10)
- search: string (optional)

Response (200):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "企业名称",
        "industry": "科技",
        "creditScore": 85,
        "riskLevel": "LOW",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 创建企业
```
POST /companies
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "企业名称",
  "unifiedSocialCreditCode": "91110000...",
  "legalRepresentative": "法定代表人",
  "address": "地址",
  "industry": "科技",
  "registrationCapital": 10000000,
  "paidInCapital": 8000000
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "企业名称"
  }
}
```

### 获取企业详情
```
GET /companies/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "企业名称",
    "unifiedSocialCreditCode": "91110000...",
    "financialData": [
      {
        "year": 2023,
        "quarter": 4,
        "revenue": 50000000,
        "profit": 5000000,
        "assets": 100000000,
        "liabilities": 40000000
      }
    ]
  }
}
```

## 报告接口

### 获取报告列表
```
GET /reports
Authorization: Bearer <token>

Query Parameters:
- page: number
- pageSize: number
- type: ReportType (optional)
- companyId: string (optional)

Response (200):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "2024年度融资方案",
        "type": "NFS",
        "status": "COMPLETED",
        "netFinancingSpace": 5000000,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

### 生成报告
```
POST /reports/generate
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "companyId": "uuid",
  "type": "NFS",
  "options": {
    "includeRiskAnalysis": true,
    "includeAssetRecommendation": true
  }
}

Response (202):
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "status": "PROCESSING"
  }
}
```

### 获取报告详情
```
GET /reports/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "2024年度融资方案",
    "type": "NFS",
    "status": "COMPLETED",
    "content": {
      "summary": "报告摘要...",
      "analysis": "详细分析...",
      "recommendations": ["建议1", "建议2"],
      "riskFactors": ["风险1", "风险2"]
    },
    "netFinancingSpace": 5000000,
    "recommendedAssets": [
      {
        "assetName": "科技成长基金",
        "assetType": "FUNDS",
        "expectedReturn": 28.5,
        "riskLevel": "MEDIUM",
        "allocation": 40,
        "rationale": "理由..."
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## NFS计算接口

### 计算净融资空间
```
POST /nfs/calculate
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "companyId": "uuid",
  "includeAssets": [
    {
      "type": "STOCKS",
      "value": 2000000
    },
    {
      "type": "BONDS", 
      "value": 1000000
    }
  ],
  "liabilities": [
    {
      "type": "LOAN",
      "amount": 500000
    }
  ],
  "riskTolerance": 0.3
}

Response (200):
{
  "success": true,
  "data": {
    "netFinancingSpace": 8500000,
    "maxFinancingAmount": 10000000,
    "riskScore": 35,
    "confidenceLevel": 85,
    "breakdown": {
      "totalAssets": 10000000,
      "totalLiabilities": 1500000,
      "riskReserve": 1000000,
      "operatingReserve": 500000
    }
  }
}
```

## 服务工单接口

### 创建服务工单
```
POST /service-orders
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "type": "FINANCING",
  "description": "需要融资咨询服务",
  "companyName": "企业名称",
  "contactName": "联系人",
  "contactPhone": "13800138000"
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "SO202401010001",
    "status": "PENDING"
  }
}
```

### 获取工单列表
```
GET /service-orders
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "orderNumber": "SO202401010001",
        "type": "FINANCING",
        "status": "IN_PROGRESS",
        "companyName": "企业名称",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 10
  }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| AUTH_001 | 无效的Token |
| AUTH_002 | Token已过期 |
| AUTH_003 | 未授权访问 |
| COMPANY_001 | 企业不存在 |
| COMPANY_002 | 企业已存在 |
| REPORT_001 | 报告生成失败 |
| REPORT_002 | 报告不存在 |
| VALIDATION_001 | 参数验证失败 |
| SERVER_001 | 服务器内部错误 |
