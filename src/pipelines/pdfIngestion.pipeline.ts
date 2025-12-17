import { splitPdf } from "../services/pdfSplit.service";
import { extractText } from "../services/pdfTextExtract.service";
import { parseMetadata } from "../services/labelMetadata.service";
import { persistLabel } from "../services/labelPersist.service";
import { log } from "../utils/logger";

export const pdfIngestionPipeline = {
  async run(pdfBuffer: Buffer, accountId: string) {
    const pages = await splitPdf(pdfBuffer);

    for (const page of pages) {
      try {
        const buffer = Buffer.isBuffer(page.buffer)
          ? page.buffer
          : Buffer.from(page.buffer);

        const text = await extractText(buffer);
        const metadata = parseMetadata(text);

        await persistLabel({
          accountId,
          pdfPath: page.path,
          metadata
        });
      } catch (err) {
        console.error("Page ingestion failed:", err);
      }
    }
  }
};
