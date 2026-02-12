// 报告控制器
import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { ResponseUtils } from '../core/response';

export class ReportController {
  // 生成报告
  async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.generate(req.body);
      res.status(201).json(ResponseUtils.created(report, 'Report generated successfully'));
    } catch (error) {
      next(error);
    }
  }

  // 获取报告详情
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await reportService.getById(req.params.id);
      res.json(ResponseUtils.success(report));
    } catch (error) {
      next(error);
    }
  }

  // 获取报告列表
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, pageSize = 20, type } = req.query;

      const result = await reportService.list(
        parseInt(page as string),
        parseInt(pageSize as string),
        type as string
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

  // 下载报告
  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await reportService.download(id);

      res.download(result.filePath, result.fileName, (err) => {
        if (err) {
          next(err);
        }
        // 清理临时文件
        try {
          const fs = require('fs');
          fs.unlinkSync(result.filePath);
        } catch (e) {
          console.error('Failed to delete temp file:', e);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // 删除报告
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await reportService.delete(req.params.id);
      res.json(ResponseUtils.success(null, 'Report deleted'));
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
