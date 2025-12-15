import { splitPdf } from "../services/pdfSplit.service";
import { extractText } from "../services/pdfTextExtract.service";
import { parseMetadata } from "../services/labelMetadata.service";
import { persistLabel } from "../services/labelPersist.service";

export const pdfIngestionPipeline = {
  async run(pdfBuffer: Buffer) {

    const pages = await splitPdf(pdfBuffer);
  
    for (const page of pages) {
      try {
        const buffer = Buffer.isBuffer(page.buffer) ? page.buffer : Buffer.from(page.buffer);
        const text = await extractText(buffer);
        const metadata = parseMetadata(text);

        await persistLabel({
            pdfPath: page.path,
            metadata
        })
      } catch (err) {
        // VERY IMPORTANT: never fail whole batch
        console.error("Page ingestion failed:", err);
      }
    }
  }
};