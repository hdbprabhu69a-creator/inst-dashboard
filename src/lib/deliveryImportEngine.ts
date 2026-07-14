import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export interface DeliveryImportResult {
  success: boolean;
  zipFile: string;
  csvFile?: string;
  extractedDir: string;
  rowsImported?: number;
  error?: string;
}

export async function extractDeliveryZip(
  zipFile: string
): Promise<DeliveryImportResult> {

  const absoluteZip = path.resolve(zipFile);

  const extractedDir = path.resolve(
    process.cwd(),
    "data",
    "delivery"
  );

  try {

    if (!fs.existsSync(absoluteZip)) {
      throw new Error("ZIP file not found.");
    }

    const zip = new AdmZip(absoluteZip);
    zip.extractAllTo(extractedDir, true);

    const csvFiles = fs
      .readdirSync(extractedDir)
      .filter(f => f.toLowerCase().endsWith(".csv"))
      .map(f => ({
        file: f,
        time: fs.statSync(path.join(extractedDir, f)).mtimeMs
      }))
      .sort((a,b)=>b.time-a.time);

    if (!csvFiles.length) {
      throw new Error("No CSV extracted.");
    }

    return {
      success: true,
      zipFile,
      csvFile: path.join(extractedDir, csvFiles[0].file),
      extractedDir
    };

  } catch (error) {

    return {
      success: false,
      zipFile,
      extractedDir,
      error:
        error instanceof Error
          ? error.message
          : String(error)
    };

  }

}

export function validateExtractedCsv(
  csvFile: string
): boolean {

  if (!fs.existsSync(csvFile)) {
    return false;
  }

  return fs.statSync(csvFile).size > 1024;

}

export function getLatestCsv(): string | null {

  const dir = path.join(
    process.cwd(),
    "data",
    "delivery"
  );

  const files = fs
    .readdirSync(dir)
    .filter(f =>
      f.toLowerCase().endsWith(".csv")
    )
    .sort();

  return files.length
    ? path.join(dir, files[0])
    : null;

}





