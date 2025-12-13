import { splitPdfToFiles } from "../utils/pdf.utils";
import { labelPoolService } from "./labelPool.service";
import { logger } from "../utils/logger";

export const pdfImportService = {
  async importPdf(buffer: Buffer, defaultPostcode?: string) {
    const files = await splitPdfToFiles(buffer, "./labels");
    for (const filePath of files) await labelPoolService.addLabel(filePath, defaultPostcode || null);
    logger.info(`Imported ${files.length} labels`);
  },
};
