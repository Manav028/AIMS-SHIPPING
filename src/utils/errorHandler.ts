import { Response } from "express";
import { log } from "./logger";

export function handleError(
  res: Response,
  error: any,
  context: string
) {
  log("ERROR", context, {
    message: error.message,
    stack: error.stack,
  });

  return res.json({
    IsError: true,
    ErrorMessage: error.message || "Internal server error",
  });
}
