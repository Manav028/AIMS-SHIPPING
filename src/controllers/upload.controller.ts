import { Request, Response } from "express";
import { pdfIngestionPipeline } from "../pipelines/pdfIngestion.pipeline";

export async function uploadPdf(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "PDF file required" });
  }

  await pdfIngestionPipeline.run(req.file.buffer);

  res.json({ success: true });
}