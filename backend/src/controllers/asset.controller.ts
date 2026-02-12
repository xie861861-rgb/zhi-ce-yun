// 资产控制器
import { Request, Response, NextFunction } from 'express';
import { assetService } from '../services/asset.service';
import { ResponseUtils } from '../core/response';

export class AssetController {
  // 创建资产
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await assetService.create(req.body);
      res.status(201).json(ResponseUtils.created(asset, 'Asset created'));
    } catch (error) {
      next(error);
    }
  }

  // 批量导入资产
  async importAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await assetService.importAssets(req.body);
      res.json(ResponseUtils.success(result, `Imported ${result.success} assets, ${result.failed} failed`));
    } catch (error) {
      next(error);
    }
  }

  // 获取资产详情
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await assetService.findById(req.params.id);
      res.json(ResponseUtils.success(asset));
    } catch (error) {
      next(error);
    }
  }

  // 搜索资产
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        enterpriseId,
        type,
        status,
        name,
        minValue,
        maxValue,
        page,
        pageSize,
      } = req.query;

      const result = await assetService.search({
        enterpriseId: enterpriseId as string,
        type: type as any,
        status: status as any,
        name: name as string,
        minValue: minValue ? parseFloat(minValue as string) : undefined,
        maxValue: maxValue ? parseFloat(maxValue as string) : undefined,
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

  // 更新资产
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const asset = await assetService.update(req.params.id, req.body);
      res.json(ResponseUtils.success(asset, 'Asset updated'));
    } catch (error) {
      next(error);
    }
  }

  // 删除资产
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await assetService.delete(req.params.id);
      res.json(ResponseUtils.success(null, 'Asset deleted'));
    } catch (error) {
      next(error);
    }
  }

  // 获取资产统计
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const statistics = await assetService.getStatistics(req.query.enterpriseId as string);
      res.json(ResponseUtils.success(statistics));
    } catch (error) {
      next(error);
    }
  }
}

export const assetController = new AssetController();
