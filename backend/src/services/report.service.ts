// 报告服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';
import * as fs from 'fs';
import * as path from 'path';

export interface ReportGenerateDto {
  type: string;
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
  createdAt: Date;
}

export class ReportService {
  // 生成报告
  async generate(userId: string, data: ReportGenerateDto) {
    // 创建报告记录
    const report = await prisma.report.create({
      data: {
        type: data.type,
        title: data.title,
        status: 'PROCESSING',
        companyId: data.enterpriseId || '',
        userId: userId,
        content: JSON.stringify({}),
      },
    });

    // 异步生成报告内容
    try {
      const content = await this.buildReportContent(data);
      
      // 更新报告
      const updatedReport = await prisma.report.update({
        where: { id: report.id },
        data: {
          content: JSON.stringify(content),
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
  async list(userId: string, page = 1, pageSize = 20, type?: string) {
    const where: any = { userId };
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

  // 删除报告
  async delete(id: string, userId: string) {
    const report = await this.getById(id);
    if (report.userId !== userId) {
      throw AppError.authorizationError('Not authorized to delete this report');
    }
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

    // 根据报告类型生成内容
    content.sections = await this.buildGenericReport(data);

    return content;
  }

  private async buildGenericReport(data: ReportGenerateDto): Promise<any[]> {
    const sections = [];

    // 企业信息（如果提供了）
    if (data.enterpriseId) {
      const company = await prisma.company.findUnique({
        where: { id: data.enterpriseId },
      });
      
      if (company) {
        sections.push({
          name: '企业基本信息',
          data: {
            name: company.name,
            creditCode: company.unifiedSocialCreditCode,
            legalPerson: company.legalRepresentative,
            registeredCapital: company.registrationCapital,
            establishmentDate: company.establishmentDate,
            address: company.address,
          },
        });
      }
    }

    // 添加分析结果
    sections.push({
      name: '分析结果',
      data: {
        creditScore: data.parameters?.creditScore || 750,
        riskLevel: data.parameters?.riskLevel || 'LOW',
        recommendation: data.parameters?.recommendation || '建议继续跟进',
      },
    });

    return sections;
  }
}

export const reportService = new ReportService();
