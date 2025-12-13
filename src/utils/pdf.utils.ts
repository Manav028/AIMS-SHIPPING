import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function splitPdfToFiles(buffer: Buffer, outputDir: string) {
  const doc = await PDFDocument.load(buffer);
  const pagesCount = doc.getPageCount();

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const files: string[] = [];

  for (let i = 0; i < pagesCount; i++) {
    const newDoc = await PDFDocument.create();
    const [copied] = await newDoc.copyPages(doc, [i]);
    newDoc.addPage(copied);

    const pdfBytes = await newDoc.save();
    const filename = `label_${Date.now()}_${i}.pdf`;
    const filePath = path.join(outputDir, filename);

    fs.writeFileSync(filePath, pdfBytes);
    files.push(filePath);
  }

  return files;
}
