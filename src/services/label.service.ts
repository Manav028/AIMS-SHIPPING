import fs from "fs";
import pool from "../db/postgres";
import { log } from "../utils/logger";

export async function generateLabel(
  accountId: number,
  orderId: number
) {

  if (!orderId) throw new Error("Missing OrderId");

  const { rows } = await pool.query(
    `SELECT *
     FROM labels
     WHERE reference = $1
       AND account_id = $2`,
    [orderId.toString(), accountId]
  );

  if (!rows.length) {
    throw new Error("No prepaid label found");
  }

  const label = rows[0];

  if (label.status !== "NEW") {
    throw new Error("Label already used");
  }

  await pool.query(
    `UPDATE labels
     SET status = 'ASSIGNED',
         assigned_at = now()
     WHERE id = $1`,
    [label.id]
  );

  const pdfBytes = fs.readFileSync(label.pdf_path);

  log("INFO", "Label assigned", { orderId });

  return {
    LeadTrackingNumber: label.tracking_number || "PREPAID",
    Cost: 0,
    Currency: "GBP",
    Package: [
      {
        SequenceNumber: 0,
        TrackingNumber: label.tracking_number || "PREPAID",
        PDFBytesDocumentationBase64: [pdfBytes.toString("base64")],
        LabelWidth: 4,
        LabelHeight: 6,
      },
    ],
  };
}

export async function cancelLabel(
  accountId: number,
  orderReference: string
) {
  await pool.query(
    `UPDATE labels
     SET status = 'NEW',
         assigned_at = null
     WHERE reference = $1
       AND account_id = $2`,
    [orderReference, accountId]
  );

  log("INFO", "Label cancelled", { orderReference });
}