import crypto from "crypto";
import pool from "../db/postgres";
import { log } from "../utils/logger";

export async function createManifest(
  accountId: number,
  orderIds: string[]
): Promise<string> {
  if (!Array.isArray(orderIds) || !orderIds.length) {
    throw new Error("Invalid OrderId list");
  }

  const reference = "MF-" + crypto.randomBytes(6).toString("hex");

  await pool.query(
    `INSERT INTO manifests (account_id, reference, order_ids)
     VALUES ($1, $2, $3)`,
    [accountId, reference, orderIds]
  );

  log("INFO", "Manifest created", { reference });
  return reference;
}
