// 工单控制器
import { Request, Response, NextFunction } from 'express';
import { serviceOrderService } from '../services/workorder.service';
import { ResponseUtils } from '../core/response';

export class WorkOrderController {
  // 创建工单
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const order = await serviceOrderService.create(userId, req.body);
      res.status(201).json(ResponseUtils.created(order, 'ServiceOrder created'));
    } catch (error) {
      next(error);
    }
  }

  // 获取工单列表
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, pageSize, status } = req.query;

      const result = await serviceOrderService.list(
        userId,
        page ? parseInt(page as string) : 1,
        pageSize ? parseInt(pageSize as string) : 20,
        status as string
      );

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
      const order = await serviceOrderService.getById(req.params.id, userId);
      res.json(ResponseUtils.success(order));
    } catch (error) {
      next(error);
    }
  }

  // 更新工单状态
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { status } = req.body;
      const order = await serviceOrderService.updateStatus(req.params.id, userId, status);
      res.json(ResponseUtils.success(order, 'Status updated'));
    } catch (error) {
      next(error);
    }
  }

  // 删除工单
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await serviceOrderService.delete(req.params.id, userId);
      res.json(ResponseUtils.success(null, 'ServiceOrder deleted'));
    } catch (error) {
      next(error);
    }
  }

  // 获取统计
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const stats = await serviceOrderService.getStatistics(userId);
      res.json(ResponseUtils.success(stats));
    } catch (error) {
      next(error);
    }
  }
}

export const workOrderController = new WorkOrderController();
