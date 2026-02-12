// 报告服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export interface ReportGenerateDto {
  type: 'CREDIT' | 'ASSET' | 'NFS' | 'COMPREHENSIVE';
  title: string;
  enterpriseId?: string;
  parameters?: any;
}

export interface ReportResult {
  id: string;
  type: string;
  title: string;
  status: string;
  content?: any;
  filePath?: string;
  createdAt: Date;
}

export class ReportService {
  // 生成报告
  async generate(data: ReportGenerateDto): Promise<ReportResult> {
    // 创建报告记录
    const report = await prisma.report.create({
      data: {
        type: data.type,
        title: data.title,
        status: 'GENERATING',
        content: {},
      },
    });

    // 异步生成报告内容
    try {
      const content = await this.buildReportContent(data);
      
      // 更新报告
      const updatedReport = await prisma.report.update({
        where: { id: report.id },
        data: {
          content,
          status: 'COMPLETED',
        },
      });

      return {
        id: updatedReport.id,
        type: updatedReport.type,
        title: updatedReport.title,
        status: updatedReport.status,
        content,
        createdAt: updatedReport.createdAt,
      };
    } catch (error) {
      // 标记为失败
      await prisma.report.update({
        where: { id: report.id },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  // 获取报告详情
  async getById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw AppError.notFoundError('Report not found');
    }

    return report;
  }

  // 获取报告列表
  async list(page = 1, pageSize = 20, type?: string) {
    const where: any = {};
    if (type) where.type = type;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.report.count({ where }),
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

  // 下载报告
  async download(id: string): Promise<{ filePath: string; fileName: string }> {
    const report = await this.getById(id);

    if (report.status !== 'COMPLETED') {
      throw AppError.badRequest('Report is not ready for download');
    }

    // 生成文件
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `report_${report.id}_${Date.now()}.json`;
    const filePath = path.join(uploadDir, fileName);

    // 写入报告内容
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));

    return { filePath, fileName: `${report.title}.json` };
  }

  // 删除报告
  async delete(id: string) {
    await this.getById(id);
    await prisma.report.delete({ where: { id } });
    return true;
  }

  // 构建报告内容
  private async buildReportContent(data: ReportGenerateDto): Promise<any> {
    const content: any = {
      title: data.title,
      type: data.type,
      generatedAt: new Date().toISOString(),
      parameters: data.parameters,
      sections: [],
    };

    switch (data.type) {
      case 'CREDIT':
        content.sections = await this.buildCreditReport(data.enterpriseId, data.parameters);
        break;
      case 'ASSET':
        content.sections = await this.buildAssetReport(data.enterpriseId, data.parameters);
        break;
      case 'NFS':
        content.sections = await this.buildNfsReport(data.enterpriseId, data.parameters);
        break;
      case 'COMPREHENSIVE':
        content.sections = await this.buildComprehensiveReport(data.enterpriseId, data.parameters);
        break;
    }

    return content;
  }

  private async buildCreditReport(enterpriseId?: string, params?: any) {
    const sections = [];

    if (enterpriseId) {
      const reports = await prisma.creditReport.findMany({
        where: { enterpriseId },
        orderBy: { createdAt: 'desc' },
        take: params?.limit || 5,
      });

      sections.push({
        name: '征信报告',
        data: reports.map(r => ({
          id: r.id,
          status: r.status,
          parsedData: r.parsedData,
          createdAt: r.createdAt,
        })),
      });
    }

    sections.push({
      name: '信用评估',
      data: {
        score: params?.creditScore || 750,
        rating: params?.creditRating || 'AA',
        riskLevel: params?.riskLevel || 'LOW',
      },
    });

    return sections;
  }

  private async buildAssetReport(enterpriseId?: string, params?: any) {
    const sections = [];

    const where = enterpriseId ? { enterpriseId } : {};
    const assets = await prisma.asset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: params?.limit || 50,
    });

    sections.push({
      name: '资产清单',
      data: {
        totalCount: assets.length,
        totalValue: assets.reduce((sum, a) => sum + (a.value || 0), 0),
        items: assets,
      },
    });

    // 按类型分组
    const byType = assets.reduce((acc, asset) => {
      const type = asset.type;
      if (!acc[type]) acc[type] = { type, count: 0, value: 0 };
      acc[type].count++;
      acc[type].value += asset.value || 0;
      return acc;
    }, {} as Record<string, any>);

    sections.push({
      name: '资产分类统计',
      data: Object.values(byType),
    });

    return sections;
  }

  private async buildNfsReport(enterpriseId?: string, params?: any) {
    const sections = [];

    if (enterpriseId) {
      const calculations = await prisma.nfsCalculation.findMany({
        where: { enterpriseId },
        orderBy: { createdAt: 'desc' },
        take: params?.limit || 10,
      });

      sections.push({
        name: 'NFS 计算记录',
        data: calculations.map(c => ({
          id: c.id,
          score: c.score,
          riskLevel: c.riskLevel,
          resultData: c.resultData,
          createdAt: c.createdAt,
        })),
      });
    }

    return sections;
  }

  private async buildComprehensiveReport(enterpriseId?: string, params?: any) {
    const sections = [];

    if (enterpriseId) {
      // 企业基本信息
      const enterprise = await prisma.enterprise.findUnique({
        where: { id: enterpriseId },
      });

      if (enterprise) {
        sections.push({
          name: '企业基本信息',
          data: {
            name: enterprise.name,
            creditCode: enterprise.creditCode,
            legalPerson: enterprise.legalPerson,
            registeredCapital: enterprise.registeredCapital,
            establishmentDate: enterprise.establishmentDate,
            address: enterprise.address,
            status: enterprise.status,
          },
        });
      }

      // 征信摘要
      const creditReports = await prisma.creditReport.count({
        where: { enterpriseId },
      });
      sections.push({
        name: '征信报告数量',
        data: { count: creditReports },
      });

      // 资产摘要
      const assets = await prisma.asset.findMany({
        where: { enterpriseId },
      });
      sections.push({
        name: '资产概况',
        data: {
          totalCount: assets.length,
          totalValue: assets.reduce((sum, a) => sum + (a.value || 0), 0),
        },
      });

      // NFS 计算摘要
      const calculations = await prisma.nfsCalculation.findMany({
        where: { enterpriseId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      if (calculations.length > 0) {
        sections.push({
          name: '最新 NFS 评估',
          data: {
            score: calculations[0].score,
            riskLevel: calculations[0].riskLevel,
            calculatedAt: calculations[0].createdAt,
          },
        });
      }
    }

    return sections;
  }
}

export const reportService = new ReportService();
