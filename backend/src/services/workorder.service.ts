// 工单服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';

export interface WorkOrderCreateDto {
  type: string;
  description: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
}

export class ServiceOrderService {
  // 创建工单
  async create(userId: string, data: WorkOrderCreateDto) {
    return prisma.serviceOrder.create({
      data: {
        userId,
        type: data.type,
        description: data.description,
        companyName: data.companyName,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        status: 'PENDING',
      },
    });
  }

  // 获取工单列表
  async list(userId: string, page = 1, pageSize = 20, status?: string) {
    const where: any = { userId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.serviceOrder.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.serviceOrder.count({ where }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 获取工单详情
  async getById(id: string, userId: string) {
    const order = await prisma.serviceOrder.findUnique({
      where: { id },
    });

    if (!order) {
      throw AppError.notFoundError('ServiceOrder not found');
    }

    // 验证权限
    if (order.userId !== userId) {
      throw AppError.authorizationError('Not authorized to view this order');
    }

    return order;
  }

  // 更新工单状态
  async updateStatus(id: string, userId: string, status: string) {
    const order = await this.getById(id, userId);
    
    // 验证状态转换
    const validTransitions: Record<string, string[]> = {
      'PENDING': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
      'COMPLETED': [],
      'CANCELLED': [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw AppError.badRequest(`Cannot transition from ${order.status} to ${status}`);
    }

    return prisma.serviceOrder.update({
      where: { id },
      data: { status },
    });
  }

  // 删除工单
  async delete(id: string, userId: string) {
    await this.getById(id, userId);
    await prisma.serviceOrder.delete({ where: { id } });
    return true;
  }

  // 获取工单统计
  async getStatistics(userId: string) {
    const where = { userId };

    const [total, pending, inProgress, completed, cancelled] = await Promise.all([
      prisma.serviceOrder.count({ where }),
      prisma.serviceOrder.count({ where: { ...where, status: 'PENDING' } }),
      prisma.serviceOrder.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.serviceOrder.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.serviceOrder.count({ where: { ...where, status: 'CANCELLED' } }),
    ]);

    return { total, pending, inProgress, completed, cancelled };
  }
}

export const serviceOrderService = new ServiceOrderService();
