// 企业服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';

export interface EnterpriseSearchDto {
  name?: string;
  creditCode?: string;
  legalPerson?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface EnterpriseParseDto {
  name: string;
  creditCode?: string;
  legalPerson?: string;
  registeredCapital?: string;
  establishmentDate?: string;
  address?: string;
  businessScope?: string;
  reportData: any;
}

export class EnterpriseService {
  // 创建企业
  async create(data: EnterpriseParseDto) {
    const existing = data.creditCode 
      ? await prisma.enterprise.findUnique({
          where: { creditCode: data.creditCode },
        })
      : null;

    if (existing) {
      throw AppError.conflictError('Enterprise with this credit code already exists');
    }

    return prisma.enterprise.create({
      data: {
        name: data.name,
        creditCode: data.creditCode,
        legalPerson: data.legalPerson,
        registeredCapital: data.registeredCapital,
        establishmentDate: data.establishmentDate 
          ? new Date(data.establishmentDate) 
          : null,
        address: data.address,
        businessScope: data.businessScope,
      },
    });
  }

  // 根据 ID 获取企业
  async findById(id: string) {
    const enterprise = await prisma.enterprise.findUnique({
      where: { id },
      include: {
        creditReports: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        assets: true,
        nfsCalculations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!enterprise) {
      throw AppError.notFoundError('Enterprise not found');
    }

    return enterprise;
  }

  // 搜索企业
  async search(params: EnterpriseSearchDto) {
    const { name, creditCode, legalPerson, status, page = 1, pageSize = 20 } = params;

    const where: any = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (creditCode) {
      where.creditCode = { contains: creditCode, mode: 'insensitive' };
    }
    if (legalPerson) {
      where.legalPerson = { contains: legalPerson, mode: 'insensitive' };
    }
    if (status) {
      where.status = status;
    }

    const [enterprises, total] = await Promise.all([
      prisma.enterprise.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              creditReports: true,
              assets: true,
            },
          },
        },
      }),
      prisma.enterprise.count({ where }),
    ]);

    return {
      data: enterprises,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 更新企业
  async update(id: string, data: Partial<EnterpriseParseDto>) {
    await this.findById(id); // 验证存在

    return prisma.enterprise.update({
      where: { id },
      data: {
        name: data.name,
        creditCode: data.creditCode,
        legalPerson: data.legalPerson,
        registeredCapital: data.registeredCapital,
        establishmentDate: data.establishmentDate 
          ? new Date(data.establishmentDate) 
          : undefined,
        address: data.address,
        businessScope: data.businessScope,
        status: data.status,
      },
    });
  }

  // 删除企业
  async delete(id: string) {
    await this.findById(id);
    await prisma.enterprise.delete({ where: { id } });
    return true;
  }
}

export const enterpriseService = new EnterpriseService();
