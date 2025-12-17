import { Request, Response, NextFunction } from "express";
import pool from "../db/postgres";
import { getAccountByToken } from "../services/account.service";

export interface AuthRequest extends Request {
  accountId?: string;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body?.AuthorizationToken;
    if (!token) {
      return res.json({ IsError: true, ErrorMessage: "Missing token" });
    }

    const { rows } = await pool.query(
      `SELECT a.id
       FROM auth_tokens t
       JOIN accounts a ON a.id = t.account_id
       WHERE t.token = $1 AND t.revoked = false`,
      [token]
    );

    if (!rows.length) {
      return res.json({ IsError: true, ErrorMessage: "Invalid token" });
    }

    (req as any).accountId = rows[0].id;
    next();
  } catch (err) {
    return res.json({ IsError: true, ErrorMessage: "Auth failed" });
  }
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const accountId = await getAccountByToken(token);

    req.accountId = accountId;
    next();
  } catch (err: any) {
    console.error("Authorization failed:", err.message);
    return res.status(401).json({ error: "Invalid or revoked token" });
  }
}