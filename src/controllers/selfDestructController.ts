import { Request, Response, NextFunction } from 'express';
import { SelfDestructService } from '../services/selfDestructService';

const selfDestructService = new SelfDestructService();

export class SelfDestructController {
  async handleSelfDestruct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { confirmationCode } = req.body;

      const result = confirmationCode
        ? await selfDestructService.confirmSelfDestruct(id, confirmationCode)
        : await selfDestructService.initiateSelfDestruct(id);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
