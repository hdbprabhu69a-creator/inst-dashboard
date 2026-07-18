import fs from "node:fs";

import { extractPdfText } from "./pdfTextParser";
import { parseTradeLedger } from "./tradeLedgerParser";

export async function importContractNote(
  pdfPath:string
){

  const pages=await extractPdfText(pdfPath);

  const text=pages
    .map(p=>p.text)
    .join("\n");

  return parseTradeLedger(text);

}
