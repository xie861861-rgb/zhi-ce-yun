// 企业控制器
import { Request, Response, NextFunction } from 'express';
import { enterpriseService } from '../services/enterprise.service';
import { ResponseUtils } from '../core/response';

export class EnterpriseController {
  // 创建企业
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const enterprise = await enterpriseService.create(req.body);
      res.status(201).json(ResponseUtils.created(enterprise, 'Enterprise created'));
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
      const { name, creditCode, legalPerson, status, page, pageSize } = req.query;

      const result = await enterpriseService.search({
        name: name as string,
        creditCode: creditCode as string,
        legalPerson: legalPerson as string,
        status: status as string,
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

  // 更新企业
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const enterprise = await enterpriseService.update(req.params.id, req.body);
      res.json(ResponseUtils.success(enterprise, 'Enterprise updated'));
    } catch (error) {
      next(error);
    }
  }

  // 删除企业
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await enterpriseService.delete(req.params.id);
      res.json(ResponseUtils.success(null, 'Enterprise deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export const enterpriseController = new EnterpriseController();
