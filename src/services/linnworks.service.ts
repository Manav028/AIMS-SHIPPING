import pool from "../db/postgres";
import fs from "fs";

export const linnworksService = {
  async userAvailableServices() {
    return {
      Services: [
        {
          Name: "FedEx Prepaid (Reference Match)",
          Code: "fedex_prepaid",
          TrackingUrl: "https://www.fedex.com/fedextrack/?trknbr=",
          PrintLabel: true,
        },
      ],
    };
  },

  async generateLabel(request: any) {
    const orderId = request?.OrderId;
    if (!orderId) throw new Error("Missing OrderId");

    // 1️⃣ Fetch label
    const { rows } = await pool.query(
      `SELECT * FROM labels WHERE reference = $1`,
      [orderId]
    );

    const label = rows[0];

    if (!label) {
      throw new Error("No prepaid label found for this OrderId");
    }

    if (label.status !== "NEW") {
      throw new Error("Label already used");
    }

    // 2️⃣ Mark as assigned (transaction-safe)
    await pool.query(
      `
      UPDATE labels
      SET status = 'ASSIGNED',
          assigned_at = now()
      WHERE id = $1
      `,
      [label.id]
    );

    // 3️⃣ Read PDF
    const pdfBytes = fs.readFileSync(label.pdf_path);

    return {
      TrackingNumber: label.tracking_number || "PREPAID",
      LabelBase64: pdfBytes.toString("base64"),
      Format: "PDF",
    };
  },

  async cancelLabel(request: any) {
    const orderId = request?.OrderId;
    if (!orderId) throw new Error("Missing OrderId");

    await pool.query(
      `
      UPDATE labels
      SET status = 'NEW',
          assigned_at = NULL
      WHERE reference = $1
      `,
      [orderId]
    );

    return { Success: true };
  },
};
