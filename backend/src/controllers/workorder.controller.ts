// 工单控制器
import { Request, Response, NextFunction } from 'express';
import { workOrderService } from '../services/workorder.service';
import { ResponseUtils } from '../core/response';

export class WorkOrderController {
  // 创建工单
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const workorder = await workOrderService.create(userId, req.body);
      res.status(201).json(ResponseUtils.created(workorder, 'WorkOrder created'));
    } catch (error) {
      next(error);
    }
  }

  // 获取工单列表
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'ADMIN';
      const { status, type, priority, page, pageSize } = req.query;

      const result = await workOrderService.list(userId, isAdmin, {
        status: status as any,
        type: type as any,
        priority: priority as any,
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 20,
      });

      res.json(ResponseUtils.paginated(
        result.data,
        result.pagination.page,
        result.pagination.pageSize,
        result.pagination.total
      ));
    } catch (error) {
      next(error);
    }
  }

  // 获取工单详情
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'ADMIN';
      const workorder = await workOrderService.getById(req.params.id, userId, isAdmin);
      res.json(ResponseUtils.success(workorder));
    } catch (error) {
      next(error);
    }
  }

  // 更新工单状态
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, result } = req.body;
      const workorder = await workOrderService.updateStatus(
        req.params.id,
        status,
        result
      );
      res.json(ResponseUtils.success(workorder, 'WorkOrder status updated'));
    } catch (error) {
      next(error);
    }
  }

  // 指派工单
  async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigneeId } = req.body;
      const workorder = await workOrderService.assign(req.params.id, assigneeId);
      res.json(ResponseUtils.success(workorder, 'WorkOrder assigned'));
    } catch (error) {
      next(error);
    }
  }

  // 取消工单
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'ADMIN';
      await workOrderService.cancel(req.params.id, userId, isAdmin);
      res.json(ResponseUtils.success(null, 'WorkOrder cancelled'));
    } catch (error) {
      next(error);
    }
  }

  // 获取工单统计
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'ADMIN';
      const statistics = await workOrderService.getStatistics(userId, isAdmin);
      res.json(ResponseUtils.success(statistics));
    } catch (error) {
      next(error);
    }
  }
}

export const workOrderController = new WorkOrderController();
