// 征信控制器
import { Request, Response, NextFunction } from 'express';
import { creditService } from '../services/credit.service';
import { ResponseUtils } from '../core/response';

export class CreditController {
  // 解析企业征信
  async parseEnterprise(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await creditService.parseEnterpriseCredit(req.body);
      res.status(201).json(ResponseUtils.created(result, 'Credit report parsed successfully'));
    } catch (error) {
      next(error);
    }
  }

  // 获取征信报告详情
  async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await creditService.getReport(req.params.id);
      res.json(ResponseUtils.success(report));
    } catch (error) {
      next(error);
    }
  }

  // 获取企业的征信报告列表
  async getEnterpriseReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      
      const result = await creditService.getEnterpriseReports(
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
}

export const creditController = new CreditController();
