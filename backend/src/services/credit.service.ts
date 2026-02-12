// 征信服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';

export interface CreditParseDto {
  enterpriseId?: string;
  enterpriseData?: {
    name: string;
    creditCode?: string;
    legalPerson?: string;
    registeredCapital?: string;
    establishmentDate?: string;
    address?: string;
    businessScope?: string;
  };
  reportData: any; // 原始征信数据
}

export interface CreditReportResult {
  id: string;
  enterpriseId: string | null;
  status: string;
  parsedData: any;
  createdAt: Date;
}

export class CreditService {
  // 解析企业征信
  async parseEnterpriseCredit(data: CreditParseDto): Promise<CreditReportResult> {
    // 如果提供了企业信息，先创建或更新企业
    let enterpriseId = data.enterpriseId;

    if (!enterpriseId && data.enterpriseData?.creditCode) {
      const existing = await prisma.enterprise.findUnique({
        where: { creditCode: data.enterpriseData.creditCode },
      });
      enterpriseId = existing?.id;
    }

    // 解析征信数据
    const parsedData = this.parseCreditReport(data.reportData);

    // 创建征信报告
    const report = await prisma.creditReport.create({
      data: {
        enterpriseId,
        reportData: data.reportData,
        parsedData,
        status: 'COMPLETED',
      },
    });

    // 如果有企业信息，更新企业记录
    if (data.enterpriseData && enterpriseId) {
      await prisma.enterprise.update({
        where: { id: enterpriseId },
        data: {
          name: data.enterpriseData.name,
          creditCode: data.enterpriseData.creditCode,
          legalPerson: data.enterpriseData.legalPerson,
          registeredCapital: data.enterpriseData.registeredCapital,
          establishmentDate: data.enterpriseData.establishmentDate
            ? new Date(data.enterpriseData.establishmentDate)
            : undefined,
          address: data.enterpriseData.address,
          businessScope: data.enterpriseData.businessScope,
        },
      });
    } else if (data.enterpriseData) {
      // 创建新企业
      const enterprise = await prisma.enterprise.create({
        data: {
          name: data.enterpriseData.name,
          creditCode: data.enterpriseData.creditCode,
          legalPerson: data.enterpriseData.legalPerson,
          registeredCapital: data.enterpriseData.registeredCapital,
          establishmentDate: data.enterpriseData.establishmentDate
            ? new Date(data.enterpriseData.establishmentDate)
            : undefined,
          address: data.enterpriseData.address,
          businessScope: data.enterpriseData.businessScope,
        },
      });

      // 更新报告关联
      await prisma.creditReport.update({
        where: { id: report.id },
        data: { enterpriseId: enterprise.id },
      });

      enterpriseId = enterprise.id;
    }

    return {
      id: report.id,
      enterpriseId: report.enterpriseId,
      status: report.status,
      parsedData: report.parsedData,
      createdAt: report.createdAt,
    };
  }

  // 获取征信报告
  async getReport(reportId: string) {
    const report = await prisma.creditReport.findUnique({
      where: { id: reportId },
      include: {
        enterprise: true,
      },
    });

    if (!report) {
      throw AppError.notFoundError('Credit report not found');
    }

    return report;
  }

  // 获取企业的所有征信报告
  async getEnterpriseReports(enterpriseId: string, page = 1, pageSize = 10) {
    const [reports, total] = await Promise.all([
      prisma.creditReport.findMany({
        where: { enterpriseId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          enterprise: {
            select: { id: true, name: true, creditCode: true },
          },
        },
      }),
      prisma.creditReport.count({ where: { enterpriseId } }),
    ]);

    return {
      data: reports,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 解析征信报告数据（模拟实现）
  private parseCreditReport(rawData: any) {
    // 实际项目中这里会调用外部征信 API 或解析引擎
    // 这里返回模拟的解析结果
    return {
      summary: {
        companyName: rawData.companyName || rawData.name,
        creditCode: rawData.creditCode || rawData.uscc,
        legalPerson: rawData.legalPerson || rawData.legal_representative,
        registeredCapital: rawData.registeredCapital || rawData.register_capital,
        establishmentDate: rawData.establishmentDate || rawData.establish_date,
        address: rawData.address || rawData.registered_address,
        businessScope: rawData.businessScope || rawData.business_scope,
      },
      riskIndicators: {
        taxRating: rawData.taxRating || 'A',
        creditRating: rawData.creditRating || 'BB',
        riskLevel: rawData.riskLevel || 'LOW',
      },
      financialHighlights: {
        revenue: rawData.revenue || null,
        profit: rawData.profit || null,
        assets: rawData.assets || null,
        liabilities: rawData.liabilities || null,
      },
      parsedAt: new Date().toISOString(),
    };
  }
}

export const creditService = new CreditService();
