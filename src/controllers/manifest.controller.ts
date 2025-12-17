import { Request, Response } from "express";
import { createManifest } from "../services/manifest.service";
import { handleError } from "../utils/errorHandler";
import { success } from "../utils/response";

export async function createManifestController(req: Request, res: Response) {
  try {
    const ref = await createManifest(
      (req as any).accountId,
      req.body.OrderId
    );
    return res.json(success({ ManifestReference: ref }));
  } catch (err) {
    return handleError(res, err, "CreateManifest");
  }
}