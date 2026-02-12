// 企业控制器
import { Request, Response, NextFunction } from 'express';
import { enterpriseService } from '../services/enterprise.service';
import { ResponseUtils } from '../core/response';

export class EnterpriseController {
  // 创建企业
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const enterprise = await enterpriseService.create(userId, req.body);
      res.status(201).json(ResponseUtils.created(enterprise, 'Company created'));
    } catch (error) {
      next(error);
    }
  }

  // 获取企业详情
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const enterprise = await enterpriseService.findById(req.params.id);
      res.json(ResponseUtils.success(enterprise));
    } catch (error) {
      next(error);
    }
  }

  // 搜索企业
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { name, page, pageSize } = req.query;

      const result = await enterpriseService.search({
        name: name as string,
        page: page ? parseInt(page as string) : 1,
        pageSize: pageSize ? parseInt(pageSize as string) : 20,
      }, userId);

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

  // 更新企业
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const enterprise = await enterpriseService.update(req.params.id, userId, req.body);
      res.json(ResponseUtils.success(enterprise, 'Company updated'));
    } catch (error) {
      next(error);
    }
  }

  // 删除企业
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await enterpriseService.delete(req.params.id, userId);
      res.json(ResponseUtils.success(null, 'Company deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export const enterpriseController = new EnterpriseController();
