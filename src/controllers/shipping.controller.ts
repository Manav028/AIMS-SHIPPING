import { Request, Response } from "express";
import { linnworksService } from "../services/linnworks.service";

export const shippingController = {
  async userServices(req: Request, res: Response) {
    return res.json(await linnworksService.userAvailableServices());
  },

  async generateLabel(req: Request, res: Response) {
    try {
      const result = await linnworksService.generateLabel(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async cancelLabel(req: Request, res: Response) {
    return res.json(await linnworksService.cancelLabel());
  },
};