// NFS 计算服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';

export interface NfsCalculateItem {
  enterpriseId: string;
  financialData: {
    revenue: number;
    profit: number;
    assets: number;
    liabilities: number;
    equity: number;
    cashFlow: number;
  };
  creditData?: {
    creditScore: number;
    riskLevel: string;
    defaultHistory: boolean;
    latePayments: number;
  };
  assetData?: {
    totalAssets: number;
    collateralValue: number;
    liquidityRatio: number;
  };
}

export interface NfsBatchDto {
  calculations: NfsCalculateItem[];
}

export interface NfsResult {
  id: string;
  enterpriseId: string;
  score: number;
  riskLevel: string;
  nfsGrade: string;
  factors: {
    financialScore: number;
    creditScore: number;
    assetScore: number;
  };
  recommendation: string;
  createdAt: Date;
}

export class NfsService {
  // 批量计算 NFS
  async calculateBatch(data: NfsBatchDto): Promise<NfsResult[]> {
    const results: NfsResult[] = [];

    for (const item of data.calculations) {
      try {
        const result = await this.calculateSingle(item);
        results.push(result);
      } catch (error) {
        // 记录错误但继续处理其他项目
        console.error(`NFS calculation failed for enterprise ${item.enterpriseId}:`, error);
        results.push({
          id: '',
          enterpriseId: item.enterpriseId,
          score: 0,
          riskLevel: 'ERROR',
          nfsGrade: 'E',
          factors: {
            financialScore: 0,
            creditScore: 0,
            assetScore: 0,
          },
          recommendation: 'Calculation failed',
          createdAt: new Date(),
        });
      }
    }

    return results;
  }

  // 单个企业 NFS 计算
  async calculateSingle(item: NfsCalculateItem): Promise<NfsResult> {
    // 验证企业存在
    const enterprise = await prisma.enterprise.findUnique({
      where: { id: item.enterpriseId },
    });

    if (!enterprise) {
      throw AppError.notFoundError(`Enterprise ${item.enterpriseId} not found`);
    }

    // 计算各项得分
    const financialScore = this.calculateFinancialScore(item.financialData);
    const creditScore = this.calculateCreditScore(item.creditData);
    const assetScore = this.calculateAssetScore(item.assetData);

    // 综合评分 (权重: 财务40%, 征信30%, 资产30%)
    const totalScore = financialScore * 0.4 + creditScore * 0.3 + assetScore * 0.3;

    // 确定风险等级
    const riskLevel = this.determineRiskLevel(totalScore);
    const nfsGrade = this.determineGrade(totalScore);
    const recommendation = this.generateRecommendation(totalScore, riskLevel);

    // 保存计算结果
    const calculation = await prisma.nfsCalculation.create({
      data: {
        enterpriseId: item.enterpriseId,
        inputData: item as any,
        resultData: {
          score: totalScore,
          riskLevel,
          nfsGrade,
          factors: {
            financialScore,
            creditScore,
            assetScore,
          },
          recommendation,
        },
        score: totalScore,
        riskLevel,
        status: 'COMPLETED',
      },
    });

    return {
      id: calculation.id,
      enterpriseId: calculation.enterpriseId,
      score: calculation.score!,
      riskLevel: calculation.riskLevel!,
      nfsGrade,
      factors: {
        financialScore,
        creditScore,
        assetScore,
      },
      recommendation,
      createdAt: calculation.createdAt,
    };
  }

  // 获取 NFS 计算历史
  async getHistory(enterpriseId: string, page = 1, pageSize = 20) {
    const [calculations, total] = await Promise.all([
      prisma.nfsCalculation.findMany({
        where: { enterpriseId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.nfsCalculation.count({ where: { enterpriseId } }),
    ]);

    return {
      data: calculations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 获取单个计算结果
  async getResult(id: string) {
    const calculation = await prisma.nfsCalculation.findUnique({
      where: { id },
      include: {
        enterprise: {
          select: { id: true, name: true, creditCode: true },
        },
      },
    });

    if (!calculation) {
      throw AppError.notFoundError('NFS calculation not found');
    }

    return calculation;
  }

  // 计算财务得分
  private calculateFinancialScore(data: NfsCalculateItem['financialData']): number {
    let score = 0;

    // 盈利能力 (0-30分)
    const profitMargin = data.revenue > 0 ? data.profit / data.revenue : 0;
    if (profitMargin > 0.2) score += 30;
    else if (profitMargin > 0.1) score += 25;
    else if (profitMargin > 0) score += 20;
    else if (profitMargin > -0.1) score += 10;
    else score += 0;

    // 偿债能力 (0-30分)
    const debtRatio = data.liabilities / (data.assets || 1);
    if (debtRatio < 0.3) score += 30;
    else if (debtRatio < 0.5) score += 25;
    else if (debtRatio < 0.7) score += 15;
    else if (debtRatio < 0.9) score += 10;
    else score += 0;

    // 现金流 (0-20分)
    if (data.cashFlow > data.liabilities * 0.1) score += 20;
    else if (data.cashFlow > 0) score += 15;
    else if (data.cashFlow > data.liabilities * -0.05) score += 10;
    else score += 0;

    // 净资产收益率 (0-20分)
    const roe = data.equity > 0 ? data.profit / data.equity : 0;
    if (roe > 0.2) score += 20;
    else if (roe > 0.1) score += 15;
    else if (roe > 0.05) score += 10;
    else if (roe > 0) score += 5;
    else score += 0;

    return Math.min(score, 100);
  }

  // 计算征信得分
  private calculateCreditScore(data?: NfsCalculateItem['creditData']): number {
    if (!data) return 50; // 无数据时给基准分

    let score = 0;

    // 信用评分 (0-50分)
    if (data.creditScore >= 800) score += 50;
    else if (data.creditScore >= 700) score += 45;
    else if (data.creditScore >= 650) score += 35;
    else if (data.creditScore >= 600) score += 25;
    else if (data.creditScore >= 500) score += 15;
    else score += 5;

    // 逾期记录 (0-30分)
    if (!data.defaultHistory) {
      if (data.latePayments === 0) score += 30;
      else if (data.latePayments <= 2) score += 20;
      else if (data.latePayments <= 5) score += 10;
      else score += 0;
    }

    // 风险等级 (0-20分)
    const riskScores: Record<string, number> = {
      'VERY_LOW': 20,
      'LOW': 15,
      'MEDIUM': 10,
      'HIGH': 5,
      'VERY_HIGH': 0,
    };
    score += riskScores[data.riskLevel] || 10;

    return Math.min(score, 100);
  }

  // 计算资产得分
  private calculateAssetScore(data?: NfsCalculateItem['assetData']): number {
    if (!data) return 50; // 无数据时给基准分

    let score = 0;

    // 资产充足性 (0-40分)
    const assetRatio = data.totalAssets > 0 ? data.totalAssets / 1000000 : 0;
    if (assetRatio > 100) score += 40;
    else if (assetRatio > 50) score += 35;
    else if (assetRatio > 10) score += 25;
    else if (assetRatio > 1) score += 15;
    else score += 5;

    // 抵押充足率 (0-30分)
    const collateralRatio = data.totalAssets > 0 
      ? data.collateralValue / data.totalAssets 
      : 0;
    if (collateralRatio > 0.8) score += 30;
    else if (collateralRatio > 0.6) score += 25;
    else if (collateralRatio > 0.4) score += 15;
    else if (collateralRatio > 0.2) score += 10;
    else score += 0;

    // 流动性 (0-30分)
    if (data.liquidityRatio > 2) score += 30;
    else if (data.liquidityRatio > 1.5) score += 25;
    else if (data.liquidityRatio > 1) score += 20;
    else if (data.liquidityRatio > 0.5) score += 10;
    else score += 0;

    return Math.min(score, 100);
  }

  // 确定风险等级
  private determineRiskLevel(score: number): string {
    if (score >= 80) return 'VERY_LOW';
    if (score >= 70) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    if (score >= 50) return 'HIGH';
    return 'VERY_HIGH';
  }

  // 确定 NFS 等级
  private determineGrade(score: number): string {
    if (score >= 90) return 'AAA';
    if (score >= 80) return 'AA';
    if (score >= 70) return 'A';
    if (score >= 60) return 'BBB';
    if (score >= 50) return 'BB';
    if (score >= 40) return 'B';
    if (score >= 30) return 'CCC';
    return 'D';
  }

  // 生成建议
  private generateRecommendation(score: number, riskLevel: string): string {
    const recommendations: Record<string, string> = {
      'VERY_LOW': '企业财务状况优秀，信用良好，建议批准贷款并提供优惠利率',
      'LOW': '企业财务状况良好，信用记录良好，建议批准贷款',
      'MEDIUM': '企业财务状况一般，建议在提供抵押或担保的情况下批准贷款',
      'HIGH': '企业风险较高，建议审慎考虑，可要求增加担保措施',
      'VERY_HIGH': '企业风险很高，建议暂缓贷款申请或要求高价值抵押',
    };
    return recommendations[riskLevel] || '无法评估';
  }
}

export const nfsService = new NfsService();
