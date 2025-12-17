import { Request, Response } from "express";
import { generateLabel, cancelLabel } from "../services/label.service";
import { handleError } from "../utils/errorHandler";
import { success } from "../utils/response";

export async function generateLabelController(req: Request, res: Response) {
  try {
    const data = await generateLabel(
      (req as any).accountId,
      req.body.OrderId
    );
    return res.json(success(data));
  } catch (err) {
    return handleError(res, err, "GenerateLabel");
  }
}

export async function cancelLabelController(req: Request, res: Response) {
  try {
    await cancelLabel(
      (req as any).accountId,
      req.body.OrderReference
    );
    return res.json(success());
  } catch (err) {
    return handleError(res, err, "CancelLabel");
  }
}