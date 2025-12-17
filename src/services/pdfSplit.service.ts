import { PDFDocument } from "pdf-lib";
import path from "path";
import { writePdf } from "../utils/fileSystem";
import { SplitPdfPage } from "../types/ingestion.types";

export async function splitPdf(buffer: Buffer): Promise<SplitPdfPage[]> {
  const doc = await PDFDocument.load(buffer);
  const pages: SplitPdfPage[] = [];

  for (let i = 0; i < doc.getPageCount(); i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(doc, [i]);
    newDoc.addPage(page);

    const bytes = await newDoc.save();
    const filePath = path.join(
      "labels",
      `label_${Date.now()}_${i + 1}.pdf`
    );

    writePdf(filePath, bytes);

    pages.push({
      path: filePath,
      buffer: Buffer.from(bytes),
      pageNumber: i + 1,
    });
  }

  return pages;
}
