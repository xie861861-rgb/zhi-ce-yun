// 资产服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';
import { AssetType, AssetStatus } from '@prisma/client';

export interface AssetSearchDto {
  enterpriseId?: string;
  type?: AssetType;
  status?: AssetStatus;
  name?: string;
  minValue?: number;
  maxValue?: number;
  page?: number;
  pageSize?: number;
}

export interface AssetCreateDto {
  enterpriseId?: string;
  name: string;
  type: AssetType;
  value?: number;
  location?: string;
  description?: string;
  status?: AssetStatus;
}

export interface AssetImportDto {
  assets: AssetCreateDto[];
}

export class AssetService {
  // 创建资产
  async create(data: AssetCreateDto) {
    if (data.enterpriseId) {
      const enterprise = await prisma.enterprise.findUnique({
        where: { id: data.enterpriseId },
      });
      if (!enterprise) {
        throw AppError.notFoundError('Enterprise not found');
      }
    }

    return prisma.asset.create({
      data: {
        enterpriseId: data.enterpriseId,
        name: data.name,
        type: data.type,
        value: data.value,
        location: data.location,
        description: data.description,
        status: data.status || 'ACTIVE',
      },
    });
  }

  // 批量导入资产
  async importAssets(data: AssetImportDto) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const [index, asset] of data.assets.entries()) {
      try {
        await this.create(asset);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  // 根据 ID 获取资产
  async findById(id: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        enterprise: {
          select: { id: true, name: true, creditCode: true },
        },
      },
    });

    if (!asset) {
      throw AppError.notFoundError('Asset not found');
    }

    return asset;
  }

  // 搜索资产
  async search(params: AssetSearchDto) {
    const {
      enterpriseId,
      type,
      status,
      name,
      minValue,
      maxValue,
      page = 1,
      pageSize = 20,
    } = params;

    const where: any = {};

    if (enterpriseId) where.enterpriseId = enterpriseId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (name) where.name = { contains: name, mode: 'insensitive' };
    
    if (minValue !== undefined || maxValue !== undefined) {
      where.value = {};
      if (minValue !== undefined) where.value.gte = minValue;
      if (maxValue !== undefined) where.value.lte = maxValue;
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          enterprise: {
            select: { id: true, name: true, creditCode: true },
          },
        },
      }),
      prisma.asset.count({ where }),
    ]);

    return {
      data: assets,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 更新资产
  async update(id: string, data: Partial<AssetCreateDto>) {
    await this.findById(id);

    if (data.enterpriseId) {
      const enterprise = await prisma.enterprise.findUnique({
        where: { id: data.enterpriseId },
      });
      if (!enterprise) {
        throw AppError.notFoundError('Enterprise not found');
      }
    }

    return prisma.asset.update({
      where: { id },
      data: {
        enterpriseId: data.enterpriseId,
        name: data.name,
        type: data.type,
        value: data.value,
        location: data.location,
        description: data.description,
        status: data.status,
      },
    });
  }

  // 删除资产
  async delete(id: string) {
    await this.findById(id);
    await prisma.asset.delete({ where: { id } });
    return true;
  }

  // 获取资产统计
  async getStatistics(enterpriseId?: string) {
    const where = enterpriseId ? { enterpriseId } : {};

    const [
      totalAssets,
      totalValue,
      typeDistribution,
      statusDistribution,
    ] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.asset.aggregate({
        where,
        _sum: { value: true },
      }),
      prisma.asset.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      prisma.asset.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalAssets,
      totalValue: totalValue._sum.value || 0,
      typeDistribution: typeDistribution.map(t => ({
        type: t.type,
        count: t._count,
      })),
      statusDistribution: statusDistribution.map(s => ({
        status: s.status,
        count: s._count,
      })),
    };
  }
}

export const assetService = new AssetService();
