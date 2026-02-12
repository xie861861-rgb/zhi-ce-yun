-- Seed data script for ZhiCeYun Intelligent Agent System
-- Database: PostgreSQL
-- Run this after migration to populate initial data

-- 1. Insert Asset Sources
INSERT INTO asset_sources (asset_type, name, description, base_url, api_endpoint, is_active, sync_frequency) VALUES
('STOCK_EXCHANGE', '联交所', '证券交易所资产来源', 'https://www.hkex.com.hk', '/api/v1/stock-exchange', true, 60),
('JUDICIAL_AUCTION', '法拍网', '司法拍卖资产来源', 'https://www.gpai.cn', '/api/v1/judicial', true, 30),
('SECOND_HAND', '二手房平台', '二手房交易平台', 'https://www.lianjia.com', '/api/v1/second-hand', true, 15)
ON CONFLICT (asset_type) DO NOTHING;

-- 2. Insert Report Templates
INSERT INTO report_templates (id, name, type, description, template_content, is_active, version) VALUES
('550e8400-e29b-41d4-a716-446655440001', '企业征信报告模板', 'CREDIT_REPORT', '标准企业征信报告模板', 
'{
  "sections": [
    {"title": "基本信息", "fields": ["enterprise_name", "registration_number", "legal_person"]},
    {"title": "信用评估", "fields": ["credit_score", "credit_level", "risk_score"]},
    {"title": "财务摘要", "fields": ["revenue", "profit", "assets"]},
    {"title": "风险提示", "fields": ["litigation_risks", "tax_compliance"]}
  ],
  "style": "standard"
}', true, '1.0.0'),

('550e8400-e29b-41d4-a716-446655440002', '资产估值报告模板', 'ASSET_VALUATION', '标准资产估值报告模板',
'{
  "sections": [
    {"title": "资产概况", "fields": ["asset_type", "address", "area"]},
    {"title": "市场分析", "fields": ["market_trend", "comparable_sales"]},
    {"title": "估值结论", "fields": ["market_value", "liquidation_value"]}
  ],
  "style": "standard"
}', true, '1.0.0'),

('550e8400-e29b-41d4-a716-446655440003', 'NFS分析报告模板', 'NFS_ANALYSIS', 'NFS综合分析报告模板',
'{
  "sections": [
    {"title": "NFS评分", "fields": ["nfs_score", "nfs_grade"]},
    {"title": "流动性分析", "fields": ["liquidity_score", "liquidity_factors"]},
    {"title": "盈利能力", "fields": ["profitability_score", "profitability_factors"]},
    {"title": "成长性", "fields": ["growth_score", "growth_factors"]},
    {"title": "稳定性", "fields": ["stability_score", "stability_factors"]},
    {"title": "市场表现", "fields": ["market_score", "market_factors"]}
  ],
  "style": "standard"
}', true, '1.0.0'),

('550e8400-e29b-41d4-a716-446655440004', '综合分析报告模板', 'COMPREHENSIVE', '企业综合分析报告模板',
'{
  "sections": [
    {"title": "企业概况", "fields": ["basic_info", "business_scope"]},
    {"title": "财务分析", "fields": ["financial_indicators", "trend_analysis"]},
    {"title": "风险评估", "fields": ["risk_level", "risk_factors"]},
    {"title": "估值结论", "fields": ["valuation", "recommendations"]}
  ],
  "style": "comprehensive"
}', true, '1.0.0')
ON CONFLICT DO NOTHING;

-- 3. Insert Sample Enterprises (使用 bcrypt 加密的密码 'password123')
INSERT INTO enterprises (id, name, unified_social_credit_code, industry, province, city, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', '北京科技有限公司', '91110000123456789X', '科技', '北京', '北京', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440002', '上海贸易有限公司', '91310000123456789Y', '贸易', '上海', '上海', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440003', '广州制造有限公司', '91440000123456789Z', '制造', '广东', '广州', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440004', '深圳互联网有限公司', '91440300123456789A', '互联网', '广东', '深圳', 'ACTIVE'),
('660e8400-e29b-41d4-a716-446655440005', '杭州电子商务有限公司', '91330100123456789B', '电商', '浙江', '杭州', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- 4. Insert Sample Users (密码均为 'password123')
INSERT INTO users (id, email, phone, password_hash, name, role, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'admin@zhiceyun.com', '13800138001', 
'$2b$10$xi.HLM1MbE9WL5vL9Fvv5e.Y5z3K2Z0L5vL9Fvv5e.Y5z3K2Z0L', '系统管理员', 'SUPER_ADMIN', 'ACTIVE'),

('770e8400-e29b-41d4-a716-446655440002', 'manager@zhiceyun.com', '13800138002',
'$2b$10$xi.HLM1MbE9WL5vL9Fvv5e.Y5z3K2Z0L5vL9Fvv5e.Y5z3K2Z0L', '客户经理', 'ADMIN', 'ACTIVE'),

('770e8400-e29b-41d4-a716-446655440003', 'analyst@zhiceyun.com', '13800138003',
'$2b$10$xi.HLM1MbE9WL5vL9Fvv5e.Y5z3K2Z0L5vL9Fvv5e.Y5z3K2Z0L', '数据分析师', 'USER', 'ACTIVE'),

('770e8400-e29b-41d4-a716-446655440004', 'user1@example.com', '13800138004',
'$2b$10$xi.HLM1MbE9WL5vL9Fvv5e.Y5z3K2Z0L5vL9Fvv5e.Y5z3K2Z0L', '普通用户', 'USER', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- 5. Insert Sample Assets
INSERT INTO assets (id, enterprise_id, asset_type, title, province, city, district, address, area, estimated_price, current_status, source_type, source_id) VALUES
-- 联交所资产
('880e8400-e29b-41d4-a716-446655440001', NULL, 'LISTED_SHARE', '华为技术有限公司股份', '广东', '深圳', '南山区', '科技园路1号', NULL, 500000000.00, 'AVAILABLE', 'STOCK_EXCHANGE', 'HKEX001'),

-- 法拍资产
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'JUDICIAL_SALE', '北京市朝阳区某商业房产', '北京', '北京', '朝阳区', '建国路88号', 500.00, 8000000.00, 'AVAILABLE', 'JUDICIAL_AUCTION', 'JUDICIAL001'),

('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'JUDICIAL_LAND', '上海市浦东新区工业用地', '上海', '上海', '浦东新区', '张江高科技园区', 10000.00, 50000000.00, 'PENDING', 'JUDICIAL_AUCTION', 'JUDICIAL002'),

-- 二手房资产
('880e8400-e29b-41d4-a716-446655440004', NULL, 'RESIDENTIAL', '深圳市福田区住宅', '广东', '深圳', '福田区', '深南大道7888号', 120.00, 15000000.00, 'AVAILABLE', 'SECOND_HAND', 'LJ001'),

('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'COMMERCIAL', '广州市天河区商铺', '广东', '广州', '天河区', '天河路100号', 200.00, 25000000.00, 'AVAILABLE', 'SECOND_HAND', 'LJ002')
ON CONFLICT DO NOTHING;

-- 6. Insert Sample Work Orders
INSERT INTO workorders (id, title, description, type, priority, status, enterprise_id, creator_id, assigned_to) VALUES
('990e8400-e29b-41d4-a716-446655440001', '企业征信查询', '查询北京科技有限公司的企业征信信息', 'ENTERPRISE_QUERY', 'HIGH', 'IN_PROGRESS', 
'660e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003'),

('990e8400-e29b-41d4-a716-446655440002', '资产估值请求', '对深圳市福田区住宅进行估值', 'ASSET_SEARCH', 'MEDIUM', 'PENDING', 
NULL, '770e8400-e29b-41d4-a716-446655440003', NULL),

('990e8400-e29b-41d4-a716-446655440003', 'NFS综合分析', '对上海贸易有限公司进行NFS分析', 'NFS_CALCULATION', 'HIGH', 'PENDING', 
'660e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', NULL),

('990e8400-e29b-41d4-a716-446655440004', '风险评估报告', '生成广州制造有限公司的风险评估报告', 'RISK_ASSESSMENT', 'MEDIUM', 'COMPLETED', 
'660e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- 7. Insert Sample Reports
INSERT INTO reports (id, title, type, template_id, enterprise_id, status, generation_progress, creator_id) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '北京科技有限公司-征信报告', 'CREDIT_REPORT', 
'550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'COMPLETED', 100, 
'770e8400-e29b-41d4-a716-446655440002'),

('aa0e8400-e29b-41d4-a716-446655440002', '深圳互联网有限公司-NFS分析报告', 'NFS_ANALYSIS', 
'550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 'COMPLETED', 100, 
'770e8400-e29b-41d4-a716-446655440003'),

('aa0e8400-e29b-41d4-a716-446655440003', '杭州电子商务有限公司-综合分析报告', 'COMPREHENSIVE', 
'550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', 'GENERATING', 60, 
'770e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- 8. Insert Sample NFS Calculation Results
INSERT INTO nfs_calculation_results (id, enterprise_id, nfs_score, nfs_grade, liquidity_score, profitability_score, growth_score, stability_score, market_score, model_version) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 85.50, 'AA', 88.00, 82.00, 90.00, 85.00, 82.00, 'NFS-v2.1'),

('bb0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 72.30, 'A', 75.00, 68.00, 80.00, 70.00, 68.00, 'NFS-v2.1'),

('bb0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 92.10, 'AAA', 95.00, 90.00, 95.00, 88.00, 92.00, 'NFS-v2.1')
ON CONFLICT DO NOTHING;

-- 9. Insert Sample Asset Valuations
INSERT INTO asset_valuations (id, asset_id, valuation_method, market_value, appraised_value, liquidation_value, valuation_model) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', '市场比较法', 8500000.00, 8000000.00, 6800000.00, 'Valuation-v1.0'),

('cc0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', '收益还原法', 52000000.00, 50000000.00, 42500000.00, 'Valuation-v1.0'),

('cc0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '市场比较法', 15800000.00, 15000000.00, 12750000.00, 'Valuation-v1.0')
ON CONFLICT DO NOTHING;

-- 10. Insert Sample Work Order Status History
INSERT INTO workorder_status_history (id, workorder_id, from_status, to_status, comment, changed_by) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'PENDING', 'IN_PROGRESS', '开始处理企业征信查询', '770e8400-e29b-41d4-a716-446655440002'),

('dd0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', 'PENDING', 'IN_PROGRESS', '启动NFS计算', '770e8400-e29b-41d4-a716-446655440003'),

('dd0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', 'PENDING', 'IN_PROGRESS', '开始风险评估', '770e8400-e29b-41d4-a716-446655440003'),

('dd0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440004', 'IN_PROGRESS', 'COMPLETED', '风险评估报告已完成', '770e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;
