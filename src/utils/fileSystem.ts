import fs from "fs";
import path from "path";

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writePdf(filePath: string, bytes: Uint8Array) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, Buffer.from(bytes));
}
