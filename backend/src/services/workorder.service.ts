// 工单服务层
import { prisma } from '../lib/prisma';
import { AppError } from '../core/error';
import { WorkOrderType, WorkOrderStatus, Priority } from '@prisma/client';

export interface WorkOrderCreateDto {
  type: WorkOrderType;
  title: string;
  description?: string;
  priority?: Priority;
  enterpriseId?: string;
  parameters?: any;
}

export class WorkOrderService {
  // 创建工单
  async create(userId: string, data: WorkOrderCreateDto) {
    // 验证企业存在（如果提供了）
    if (data.enterpriseId) {
      const enterprise = await prisma.enterprise.findUnique({
        where: { id: data.enterpriseId },
      });
      if (!enterprise) {
        throw AppError.notFoundError('Enterprise not found');
      }
    }

    return prisma.workOrder.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
      },
    });
  }

  // 获取工单列表
  async list(userId: string, isAdmin: boolean, params: {
    status?: WorkOrderStatus;
    type?: WorkOrderType;
    priority?: Priority;
    page?: number;
    pageSize?: number;
  }) {
    const { status, type, priority, page = 1, pageSize = 20 } = params;

    const where: any = {};

    // 非管理员只能看自己的工单
    if (!isAdmin) {
      where.userId = userId;
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    const [workorders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.workOrder.count({ where }),
    ]);

    return {
      data: workorders,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // 获取工单详情
  async getById(id: string, userId: string, isAdmin: boolean) {
    const workorder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!workorder) {
      throw AppError.notFoundError('WorkOrder not found');
    }

    // 非管理员只能看自己的工单
    if (!isAdmin && workorder.userId !== userId) {
      throw AppError.authorizationError('Access denied');
    }

    return workorder;
  }

  // 更新工单状态
  async updateStatus(id: string, status: WorkOrderStatus, result?: string) {
    await this.getById(id, '', true); // 验证存在

    // 验证状态转换
    this.validateStatusTransition(status);

    return prisma.workOrder.update({
      where: { id },
      data: {
        status,
        result,
      },
    });
  }

  // 指派工单
  async assign(id: string, assigneeId?: string) {
    await this.getById(id, '', true);

    return prisma.workOrder.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        // 可以添加 assignee 字段
      },
    });
  }

  // 取消工单
  async cancel(id: string, userId: string, isAdmin: boolean) {
    const workorder = await this.getById(id, userId, isAdmin);

    if (workorder.status !== 'OPEN' && !isAdmin) {
      throw AppError.badRequest('Only open workorders can be cancelled');
    }

    return prisma.workOrder.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }

  // 获取工单统计
  async getStatistics(userId: string, isAdmin: boolean) {
    const where = isAdmin ? {} : { userId };

    const [
      total,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      byType,
      byPriority,
    ] = await Promise.all([
      prisma.workOrder.count({ where }),
      prisma.workOrder.count({ where: { ...where, status: 'OPEN' } }),
      prisma.workOrder.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.workOrder.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.workOrder.count({ where: { ...where, status: 'CLOSED' } }),
      prisma.workOrder.groupBy({
        by: ['type'],
        where,
        _count: true,
      }),
      prisma.workOrder.groupBy({
        by: ['priority'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: {
        open: openCount,
        inProgress: inProgressCount,
        pendingCustomer: await prisma.workOrder.count({ 
          where: { ...where, status: 'PENDING_CUSTOMER' } 
        }),
        resolved: resolvedCount,
        closed: closedCount,
      },
      byType: byType.map(t => ({
        type: t.type,
        count: t._count,
      })),
      byPriority: byPriority.map(p => ({
        priority: p.priority,
        count: p._count,
      })),
    };
  }

  // 验证状态转换
  private validateStatusTransition(newStatus: WorkOrderStatus) {
    const validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      OPEN: ['IN_PROGRESS', 'CLOSED', 'CANCELLED'],
      IN_PROGRESS: ['PENDING_CUSTOMER', 'RESOLVED', 'CLOSED'],
      PENDING_CUSTOMER: ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: [], // 终态
    };

    // 这里需要传入当前状态，暂时简化处理
    // 实际项目中应该先查询当前状态
  }
}

export const workOrderService = new WorkOrderService();
