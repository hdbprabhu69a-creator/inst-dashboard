import fs from "node:fs";
import pdf from "pdf-parse";

export interface PdfPage{
  page:number;
  text:string;
}

export async function extractPdfText(
  pdfPath:string
):Promise<PdfPage[]>{

  const buffer=fs.readFileSync(pdfPath);

  const data=await pdf(buffer);

  return [{
    page:1,
    text:data.text
  }];

}

