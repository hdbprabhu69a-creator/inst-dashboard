import fs from "fs";
import path from "path";

export interface DeliveryHistoryResult {
  success: boolean;
  archivedZip?: string;
  archivedCsv?: string;
  logFile?: string;
  error?: string;
}

function ensure(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function archiveDeliveryFiles(
  zipFile: string,
  csvFile: string
): DeliveryHistoryResult {

  try {

    const archiveDir = path.join(
      process.cwd(),
      "data",
      "delivery",
      "archive"
    );

    const logDir = path.join(
      process.cwd(),
      "logs",
      "delivery"
    );

    ensure(archiveDir);
    ensure(logDir);

    const zipTarget = path.join(
      archiveDir,
      path.basename(zipFile)
    );

    const csvTarget = path.join(
      archiveDir,
      path.basename(csvFile)
    );

    if (fs.existsSync(zipFile))
      fs.renameSync(zipFile, zipTarget);

    if (fs.existsSync(csvFile))
      fs.renameSync(csvFile, csvTarget);

    const stamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-");

    const logFile = path.join(
      logDir,
      `delivery_${stamp}.log`
    );

    fs.writeFileSync(
      logFile,
`Delivery Pipeline Completed

ZIP : ${zipTarget}

CSV : ${csvTarget}

Completed : ${new Date().toLocaleString()}
`
    );

    return {
      success: true,
      archivedZip: zipTarget,
      archivedCsv: csvTarget,
      logFile
    };

  } catch (error) {

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : String(error)
    };

  }

}
