import fs from "node:fs/promises";
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy
} from "pdfjs-dist/legacy/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

export interface LoadedPdf {
  document: PDFDocumentProxy;
  pageCount: number;
}

export async function loadPdf(
  pdfPath: string
): Promise<LoadedPdf> {

  const data = await fs.readFile(pdfPath);

  const loadingTask = getDocument({
    data: new Uint8Array(data),
    useSystemFonts: true,
    stopAtErrors: true
  });

  const document = await loadingTask.promise;

  return {
    document,
    pageCount: document.numPages
  };

}

export async function getPageCount(
  pdfPath: string
): Promise<number> {

  const pdf = await loadPdf(pdfPath);

  return pdf.pageCount;

}
