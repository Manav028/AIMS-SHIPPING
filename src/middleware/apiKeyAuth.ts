import { Request, Response, NextFunction } from "express";
import config from "../config/env";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  if (!key || key !== config.apiKey) return res.status(401).json({ error: "Unauthorized" });
  next();
}
