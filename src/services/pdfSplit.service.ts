import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function splitPdf(buffer: Buffer) {
  const doc = await PDFDocument.load(buffer);
  const pages = [];

  for (let i = 0; i < doc.getPageCount(); i++) {
    const newDoc = await PDFDocument.create();
    const [page] = await newDoc.copyPages(doc, [i]);
    newDoc.addPage(page);

    const bytes = await newDoc.save();
    const filePath = path.join("labels", `label_${Date.now()}_${i}.pdf`);

    fs.writeFileSync(filePath, bytes);

    pages.push({
      path: filePath,
      buffer: bytes
    });
  }

  return pages;
}
