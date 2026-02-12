// 企业服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';

export interface CompanySearchDto {
  name?: string;
  creditCode?: string;
  legalPerson?: string;
  page?: number;
  pageSize?: number;
}

export interface CompanyCreateDto {
  name: string;
  unifiedSocialCreditCode?: string;
  legalRepresentative?: string;
  registrationCapital?: number;
  paidInCapital?: number;
  establishmentDate?: Date;
  address?: string;
  businessScope?: string;
  industry?: string;
  annualRevenue?: number;
  totalAssets?: number;
  totalLiabilities?: number;
  netAssets?: number;
  creditScore?: number;
  riskLevel?: string;
}

export class EnterpriseService {
  // 创建企业
  async create(userId: string, data: CompanyCreateDto) {
    // 检查统一社会信用代码是否已存在
    if (data.unifiedSocialCreditCode) {
      const existing = await prisma.company.findUnique({
        where: { unifiedSocialCreditCode: data.unifiedSocialCreditCode },
      });
      if (existing) {
        throw AppError.conflictError('Company with this credit code already exists');
      }
    }

    return prisma.company.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  // 根据 ID 获取企业
  async findById(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        financialData: {
          orderBy: { year: 'desc' },
          take: 5,
        },
      },
    });

    if (!company) {
      throw AppError.notFoundError('Company not found');
    }

    return company;
  }

  // 搜索企业
  async search(params: CompanySearchDto, userId: string) {
    const { name, page = 1, pageSize = 20 } = params;

    const where: any = { userId };

    if (name) {
      where.name = { contains: name };
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { reports: true },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 更新企业
  async update(id: string, userId: string, data: Partial<CompanyCreateDto>) {
    const company = await this.findById(id);
    
    // 验证权限
    if (company.userId !== userId) {
      throw AppError.authorizationError('Not authorized to update this company');
    }

    return prisma.company.update({
      where: { id },
      data,
    });
  }

  // 删除企业
  async delete(id: string, userId: string) {
    const company = await this.findById(id);
    
    // 验证权限
    if (company.userId !== userId) {
      throw AppError.authorizationError('Not authorized to delete this company');
    }

    await prisma.company.delete({ where: { id } });
    return true;
  }
}

export const enterpriseService = new EnterpriseService();
