// Shared Types for ZhiCeYun Project

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ANALYST = 'ANALYST',
}

// Company Types
export interface Company {
  id: string;
  name: string;
  unifiedSocialCreditCode?: string;
  registrationCapital?: number;
  paidInCapital?: number;
  establishmentDate?: Date;
  legalRepresentative?: string;
  address?: string;
  businessScope?: string;
  industry?: string;
  annualRevenue?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  netAssets?: number;
  creditScore?: number;
  riskLevel?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Financial Data Types
export interface FinancialData {
  id: string;
  companyId: string;
  year: number;
  quarter?: number;
  revenue?: number;
  profit?: number;
  assets?: number;
  liabilities?: number;
  createdAt: Date;
}

// Report Types
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  content?: ReportContent;
  netFinancingSpace?: number;
  recommendedAssets?: AssetRecommendation[];
  companyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReportType {
  CREDIT = 'CREDIT',
  NFS = 'NFS',
  ASSET_CONFIG = 'ASSET_CONFIG',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ReportContent {
  summary: string;
  analysis: string;
  recommendations: string[];
  riskFactors: string[];
}

// NFS (Net Financing Space) Types
export interface NFSResult {
  netFinancingSpace: number;
  maxFinancingAmount: number;
  recommendedAssets: AssetRecommendation[];
  riskScore: number;
  confidenceLevel: number;
}

export interface AssetRecommendation {
  assetName: string;
  assetType: AssetType;
  expectedReturn: number;
  riskLevel: string;
  allocation: number;
  rationale: string;
}

export enum AssetType {
  STOCKS = 'STOCKS',
  BONDS = 'BONDS',
  ETFs = 'ETFs',
  REAL_ESTATE = 'REAL_ESTATE',
  FUNDS = 'FUNDS',
  DEPOSITS = 'DEPOSITS',
  OTHER = 'OTHER',
}

// Service Order Types
export interface ServiceOrder {
  id: string;
  type: ServiceType;
  status: OrderStatus;
  description: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ServiceType {
  CONSULTATION = 'CONSULTATION',
  FINANCING = 'FINANCING',
  ASSET_MANAGEMENT = 'ASSET_MANAGEMENT',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
