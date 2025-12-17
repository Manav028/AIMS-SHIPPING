import fs from "fs";
import path from "path";
import pool from "../db/postgres";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "app.log");

type LogLevel = "INFO" | "WARN" | "ERROR";

export async function log(
  level: LogLevel,
  message: string,
  meta?: any
) {
  const entry = {
    level,
    message,
    meta: meta ? JSON.stringify(meta) : null,
    timestamp: new Date(),
  };

  console[level === "ERROR" ? "error" : "log"](entry);

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");

  pool.query(
    `INSERT INTO app_logs (level, message, meta)
     VALUES ($1, $2, $3)`,
    [level, message, entry.meta]
  ).catch(() => {});
}
