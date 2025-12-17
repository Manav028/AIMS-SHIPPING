import { Request, Response } from "express";
import { getUserConfig, updateConfig } from "../services/config.service";
import { handleError } from "../utils/errorHandler";
import { success } from "../utils/response";

export async function userConfigController(req: Request, res: Response) {
  try {
    const data = await getUserConfig((req as any).accountId);
    return res.json(success(data));
  } catch (err) {
    return handleError(res, err, "UserConfig");
  }
}

export async function updateConfigController(req: Request, res: Response) {
  try {
    await updateConfig((req as any).accountId, req.body.ConfigItems);
    return res.json(success());
  } catch (err) {
    return handleError(res, err, "UpdateConfig");
  }
}
