-- Migration script for ZhiCeYun Intelligent Agent System
-- Database: PostgreSQL
-- This script creates all required tables with proper relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enterprise_status AS ENUM ('ACTIVE', 'INACTIVE', 'DISSOLVED', 'BANKRUPT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('GENERATING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM (
        'LISTED_SHARE', 'BOND', 
        'JUDICIAL_SALE', 'JUDICIAL_LAND', 'JUDICIAL_VEHICLE', 'JUDICIAL_MACHINERY',
        'RESIDENTIAL', 'COMMERCIAL', 'OFFICE', 'INDUSTRIAL', 'PARKING', 'LAND'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM ('AVAILABLE', 'PENDING', 'SOLD', 'OFF_MARKET', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_source_type AS ENUM ('STOCK_EXCHANGE', 'JUDICIAL_AUCTION', 'SECOND_HAND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_type AS ENUM (
        'CREDIT_REPORT', 'RISK_ASSESSMENT', 'ASSET_VALUATION', 
        'NFS_ANALYSIS', 'COMPREHENSIVE', 'CUSTOM'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_type AS ENUM (
        'ENTERPRISE_QUERY', 'ASSET_SEARCH', 'REPORT_GENERATION', 
        'RISK_ASSESSMENT', 'NFS_CALCULATION', 'DATA_SYNC', 
        'SYSTEM_MAINTENANCE', 'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_order_status AS ENUM (
        'PENDING', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'WAITING_APPROVAL', 
        'COMPLETED', 'CANCELLED', 'FAILED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==================== 1. Users Table ====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role user_role DEFAULT 'USER',
    status user_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- ==================== 2. User Sessions Table ====================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    ip_address VARCHAR(100),
    user_agent VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ==================== 3. Enterprises Table ====================
CREATE TABLE IF NOT EXISTS enterprises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    unified_social_credit_code VARCHAR(50) UNIQUE,
    registration_number VARCHAR(50),
    tax_number VARCHAR(50),
    industry VARCHAR(200),
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address VARCHAR(500),
    legal_person VARCHAR(255),
    registered_capital DECIMAL(18, 2),
    paid_in_capital DECIMAL(18, 2),
    establishment_date TIMESTAMP WITH TIME ZONE,
    business_scope TEXT,
    status enterprise_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_enterprises_name ON enterprises(name);
CREATE INDEX IF NOT EXISTS idx_enterprises_credit_code ON enterprises(unified_social_credit_code);
CREATE INDEX IF NOT EXISTS idx_enterprises_deleted_at ON enterprises(deleted_at);

-- ==================== 4. Enterprise Credit Reports Table ====================
CREATE TABLE IF NOT EXISTS enterprise_credit_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    report_number VARCHAR(100) NOT NULL UNIQUE,
    report_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    credit_score INTEGER,
    credit_level VARCHAR(50),
    risk_score INTEGER,
    risk_level VARCHAR(50),
    main_business TEXT,
    financial_highlights TEXT,
    litigation_risks TEXT,
    tax_compliance TEXT,
    banking_status TEXT,
    report_data JSONB,
    status report_status DEFAULT 'GENERATING',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_credit_reports_enterprise_id ON enterprise_credit_reports(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_credit_reports_report_number ON enterprise_credit_reports(report_number);
CREATE INDEX IF NOT EXISTS idx_credit_reports_report_date ON enterprise_credit_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_credit_reports_deleted_at ON enterprise_credit_reports(deleted_at);

-- ==================== 5. Watermother Reports Table ====================
CREATE TABLE IF NOT EXISTS watermother_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    report_number VARCHAR(100) NOT NULL UNIQUE,
    report_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    overall_score INTEGER,
    overall_rating VARCHAR(50),
    industry_comparison TEXT,
    growth_potential TEXT,
    financial_health TEXT,
    management_quality TEXT,
    market_position TEXT,
    report_data JSONB,
    status report_status DEFAULT 'GENERATING',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_watermother_reports_enterprise_id ON watermother_reports(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_watermother_reports_report_number ON watermother_reports(report_number);
CREATE INDEX IF NOT EXISTS idx_watermother_reports_report_date ON watermother_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_watermother_reports_deleted_at ON watermother_reports(deleted_at);

-- ==================== 6. Enterprise Risk Profiles Table ====================
CREATE TABLE IF NOT EXISTS enterprise_risk_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    profile_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_score INTEGER,
    risk_level VARCHAR(50),
    risk_categories JSONB,
    risk_factors JSONB,
    risk_recommendations TEXT,
    overall_assessment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_risk_profiles_enterprise_id ON enterprise_risk_profiles(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_profile_date ON enterprise_risk_profiles(profile_date);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_deleted_at ON enterprise_risk_profiles(deleted_at);

-- ==================== 7. Asset Sources Table ====================
CREATE TABLE IF NOT EXISTS asset_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_type asset_source_type NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_url VARCHAR(500),
    api_endpoint VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== 8. Assets Table ====================
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID REFERENCES enterprises(id) ON DELETE SET NULL,
    asset_type asset_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    address VARCHAR(500),
    area DECIMAL(18, 4),
    area_unit VARCHAR(20),
    estimated_price DECIMAL(18, 2),
    floor INTEGER,
    total_floors INTEGER,
    property_type VARCHAR(100),
    usage_type VARCHAR(100),
    current_status asset_status DEFAULT 'AVAILABLE',
    listing_price DECIMAL(18, 2),
    source_type asset_source_type NOT NULL,
    source_id VARCHAR(200),
    source_url VARCHAR(500),
    metadata JSONB,
    images JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_assets_enterprise_id ON assets(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_source_type ON assets(source_type);
CREATE INDEX IF NOT EXISTS idx_assets_current_status ON assets(current_status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(province, city);
CREATE INDEX IF NOT EXISTS idx_assets_deleted_at ON assets(deleted_at);

-- ==================== 9. Asset Valuations Table ====================
CREATE TABLE IF NOT EXISTS asset_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    valuation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valuation_method VARCHAR(100),
    market_value DECIMAL(18, 2),
    appraised_value DECIMAL(18, 2),
    liquidation_value DECIMAL(18, 2),
    comparable_data JSONB,
    valuation_notes TEXT,
    valuation_model VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_asset_valuations_asset_id ON asset_valuations(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_valuations_date ON asset_valuations(valuation_date);

-- ==================== 10. NFS Calculation Results Table ====================
CREATE TABLE IF NOT EXISTS nfs_calculation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enterprise_id UUID NOT NULL REFERENCES enterprises(id) ON DELETE CASCADE,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    nfs_score DECIMAL(10, 4),
    nfs_grade VARCHAR(10),
    liquidity_score DECIMAL(10, 4),
    profitability_score DECIMAL(10, 4),
    growth_score DECIMAL(10, 4),
    stability_score DECIMAL(10, 4),
    market_score DECIMAL(10, 4),
    raw_data JSONB,
    calculation_params JSONB,
    model_version VARCHAR(50),
    confidence_level DECIMAL(5, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nfs_results_enterprise_id ON nfs_calculation_results(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_nfs_results_calculation_date ON nfs_calculation_results(calculation_date);
CREATE INDEX IF NOT EXISTS idx_nfs_results_nfs_grade ON nfs_calculation_results(nfs_grade);

-- ==================== 11. NFS Params Snapshots Table ====================
CREATE TABLE IF NOT EXISTS nfs_params_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calculation_id UUID NOT NULL UNIQUE REFERENCES nfs_calculation_results(id) ON DELETE CASCADE,
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    params_data JSONB NOT NULL,
    params_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nfs_snapshots_calculation_id ON nfs_params_snapshots(calculation_id);
CREATE INDEX IF NOT EXISTS idx_nfs_snapshots_date ON nfs_params_snapshots(snapshot_date);

-- ==================== 12. Report Templates Table ====================
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type report_type NOT NULL,
    description TEXT,
    template_content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_report_templates_type ON report_templates(type);
CREATE INDEX IF NOT EXISTS idx_report_templates_active ON report_templates(is_active);

-- ==================== 13. Reports Table ====================
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    type report_type NOT NULL,
    template_id UUID REFERENCES report_templates(id),
    enterprise_id UUID REFERENCES enterprises(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    content JSONB NOT NULL,
    status report_status DEFAULT 'GENERATING',
    generation_progress INTEGER DEFAULT 0,
    file_path VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    generated_by VARCHAR(20),
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_enterprise_id ON reports(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_reports_asset_id ON reports(asset_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_creator_id ON reports(creator_id);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON reports(assigned_to);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_deleted_at ON reports(deleted_at);

-- ==================== 14. Work Orders Table ====================
CREATE TABLE IF NOT EXISTS workorders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type work_order_type NOT NULL,
    priority work_order_priority DEFAULT 'MEDIUM',
    status work_order_status DEFAULT 'PENDING',
    enterprise_id UUID REFERENCES enterprises(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_workorders_type ON workorders(type);
CREATE INDEX IF NOT EXISTS idx_workorders_priority ON workorders(priority);
CREATE INDEX IF NOT EXISTS idx_workorders_status ON workorders(status);
CREATE INDEX IF NOT EXISTS idx_workorders_enterprise_id ON workorders(enterprise_id);
CREATE INDEX IF NOT EXISTS idx_workorders_creator_id ON workorders(creator_id);
CREATE INDEX IF NOT EXISTS idx_workorders_assigned_to ON workorders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_workorders_created_at ON workorders(created_at);
CREATE INDEX IF NOT EXISTS idx_workorders_deleted_at ON workorders(deleted_at);

-- ==================== 15. Work Order Status History Table ====================
CREATE TABLE IF NOT EXISTS workorder_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workorder_id UUID NOT NULL REFERENCES workorders(id) ON DELETE CASCADE,
    from_status work_order_status,
    to_status work_order_status NOT NULL,
    comment TEXT,
    changed_by VARCHAR(200),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workorder_history_workorder_id ON workorder_status_history(workorder_id);
CREATE INDEX IF NOT EXISTS idx_workorder_history_changed_at ON workorder_status_history(changed_at);

-- ==================== Comments ====================
COMMENT ON TABLE users IS '用户表，存储系统用户信息';
COMMENT ON TABLE user_sessions IS '用户会话表，管理用户登录状态';
COMMENT ON TABLE enterprises IS '企业表，存储企业基本信息';
COMMENT ON TABLE enterprise_credit_reports IS '企业征信报告表';
COMMENT ON TABLE watermother_reports IS '水母报告表，存储企业分析报告';
COMMENT ON TABLE enterprise_risk_profiles IS '企业风险画像表';
COMMENT ON TABLE asset_sources IS '资产来源配置表';
COMMENT ON TABLE assets IS '资产表，存储各类资产信息';
COMMENT ON TABLE asset_valuations IS '资产估值记录表';
COMMENT ON TABLE nfs_calculation_results IS 'NFS计算结果表';
COMMENT ON TABLE nfs_params_snapshots IS 'NFS计算参数快照表';
COMMENT ON TABLE report_templates IS '报告模板表';
COMMENT ON TABLE reports IS '生成的报告表';
COMMENT ON TABLE workorders IS '工单表';
COMMENT ON TABLE workorder_status_history IS '工单状态变更历史表';
