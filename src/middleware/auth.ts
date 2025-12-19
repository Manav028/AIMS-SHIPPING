import { Response, NextFunction } from "express";
import { Request } from "express";
import { getAccountByToken } from "../services/account.service";
import { log } from "../utils/logger";

export interface AuthRequest extends Request {
  accountId?: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.body?.AuthorizationToken ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return res.json({
        IsError: true,
        ErrorMessage: "Missing AuthorizationToken"
      });
    }

    const accountId = await getAccountByToken(token);

    if (!accountId) {
      return res.json({
        IsError: true,
        ErrorMessage: "Invalid or revoked AuthorizationToken"
      });
    }

    req.accountId = accountId;

    next();
  } catch (err: any) {
    console.error("Auth failed:", err);

    log("INFO", "New user registered", { accountId: req.accountId });

    return res.json({
      IsError: true,
      ErrorMessage: "Authentication failed"
    });
  }
}
