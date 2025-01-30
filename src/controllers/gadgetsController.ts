import { Request, Response, NextFunction } from 'express';
import { GadgetService } from '../services/gadgetService';
import { string } from 'zod';

const gadgetService = new GadgetService();

export class GadgetController {

  async getAllGadgets(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
      // console.log(status);

      const gadgets = await gadgetService.getAllGadgets(status);
      res.json({
        success: true,
        data: gadgets
      });
    } catch (error) {
      next(error);
    }
  }

  async createGadget(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      const gadget = await gadgetService.createGadget(name);
      res.status(201).json({
        success: true,
        data: gadget
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGadget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const gadget = await gadgetService.updateGadget(id, req.body);
      res.json({
        success: true,
        data: gadget
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGadget(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const gadget = await gadgetService.decommissionGadget(id);
      res.json({
        success: true,
        data: gadget
      });
    } catch (error) {
      next(error);
    }
  }

}