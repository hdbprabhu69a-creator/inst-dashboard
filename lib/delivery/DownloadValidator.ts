import fs from "fs";
import path from "path";
import { DELIVERY_CONFIG } from "./config";
import type { ValidationResult } from "./types";

export class DownloadValidator {

  validate(filePath: string): ValidationResult {

    if (!fs.existsSync(filePath)) {
      return {
        valid: false,
        reason: "File does not exist",
        fileName: path.basename(filePath),
        fileSize: 0
      };
    }

    const stat = fs.statSync(filePath);

    if (stat.size < 1024) {
      return {
        valid: false,
        reason: "Downloaded file is too small",
        fileName: path.basename(filePath),
        fileSize: stat.size
      };
    }

    const fileName = path.basename(filePath);

if (fileName.toLowerCase().endsWith(".zip")) {
  return {
    valid: true,
    fileName,
    fileSize: stat.size
  };
}

    if (!DELIVERY_CONFIG.FILE_PATTERN.test(fileName)) {
      return {
        valid: false,
        reason: "Filename does not match expected NSE Delivery format",
        fileName,
        fileSize: stat.size
      };
    }

    const content = fs.readFileSync(filePath, "utf8");

    if (
      content.startsWith("<!DOCTYPE") ||
      content.startsWith("<html") ||
      content.includes("<body")
    ) {
      return {
        valid: false,
        reason: "HTML page downloaded instead of CSV",
        fileName,
        fileSize: stat.size
      };
    }

    const lines = content.split(/\r?\n/);

    if (lines.length < 2) {
      return {
        valid: false,
        reason: "CSV contains insufficient rows",
        fileName,
        fileSize: stat.size
      };
    }

    const headers = lines[0]
      .split(",")
      .map(h => h.trim());

    const required = [
      "SYMBOL",
      "DATE1",
      "TTL_TRD_QNTY",
      "DELIV_QTY",
      "DELIV_PER"
    ];

    const missing = required.filter(h => !headers.includes(h));

    if (missing.length) {
      return {
        valid: false,
        reason: `Missing headers: ${missing.join(", ")}`,
        fileName,
        fileSize: stat.size,
        headers
      };
    }

    return {
      valid: true,
      fileName,
      fileSize: stat.size,
      headers
    };
  }
}


