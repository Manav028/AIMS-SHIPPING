import pool from "../db/postgres";

export async function persistLabel(input: {
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
    INSERT INTO labels (pdf_path, reference, tracking_number)
    VALUES ($1, $2, $3)
    ON CONFLICT (reference) DO UPDATE
    SET
      pdf_path = EXCLUDED.pdf_path,
      tracking_number = EXCLUDED.tracking_number
  `;

  await pool.query(query, [
    input.pdfPath,
    input.metadata.reference,
    input.metadata.fedexTracking ?? null,
  ]);
}
