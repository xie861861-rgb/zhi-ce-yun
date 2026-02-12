// NFS 计算控制器
import { Request, Response, NextFunction } from 'express';
import { nfsService } from '../services/nfs.service';
import { ResponseUtils } from '../core/response';

export class NfsController {
  // 批量计算 NFS
  async calculateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await nfsService.calculateBatch(req.body);
      res.json(ResponseUtils.success(result, 'NFS calculation completed'));
    } catch (error) {
      next(error);
    }
  }

  // 获取计算历史
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      
      const result = await nfsService.getHistory(
        req.params.enterpriseId,
        parseInt(page as string),
        parseInt(pageSize as string)
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

  // 获取单个计算结果
  async getResult(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await nfsService.getResult(req.params.id);
      res.json(ResponseUtils.success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const nfsController = new NfsController();
