import { Response } from "express";
import { pdfIngestionPipeline } from "../pipelines/pdfIngestion.pipeline";
import { AuthRequest } from "../middleware/auth";

export async function uploadPdf(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file required" });
    }

    if (!req.accountId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await pdfIngestionPipeline.run(req.file.buffer, req.accountId);

    res.json({ success: true });
  } catch (err: any) {
    console.error("Upload failed:", err.message);
    res.status(500).json({ error: err.message });
  }
}
