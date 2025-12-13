import fs from "fs";
import { pdfImportService } from "../services/pdfImport.service";

async function run() {
  const pdfBuffer = fs.readFileSync("./daily-fedex.pdf"); // Place daily PDF in project root
  await pdfImportService.importPdf(pdfBuffer, null);
  console.log("Daily labels imported successfully");
}

run();