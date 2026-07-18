import fs from "node:fs";
import {getDocument} from "pdfjs-dist/legacy/build/pdf.mjs";

export async function loadPdf(path:string){

    const buffer=fs.readFileSync(path);

    return getDocument({
        data:new Uint8Array(buffer),
        useSystemFonts:true
    }).promise;

}
