import pool from "../db/postgres";
import { PersistLabelInput } from "../types/ingestion.types";
import { log } from "../utils/logger";

export async function persistLabel(input: {
  accountId: string;
  pdfPath: string;
  metadata: {
    reference: string | null;
    fedexTracking: string | null;
  };
}) {
  if (!input.metadata.reference) {
    throw new Error("Missing REF (Linnworks OrderId)");
  }

  const query = `
    INSERT INTO labels (
      account_id,
      reference,
      tracking_number,
      pdf_path
    )
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (reference) DO UPDATE
    SET
      tracking_number = EXCLUDED.tracking_number,
      pdf_path = EXCLUDED.pdf_path
  `;

  await pool.query(query, [
    input.accountId,
    input.metadata.reference,
    input.metadata.fedexTracking,
    input.pdfPath
  ]);
}
