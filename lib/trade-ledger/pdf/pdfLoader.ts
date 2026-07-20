import fs from "node:fs";

export async function loadPdf(
    path:string
){

    const buffer = fs.readFileSync(path);

    const pdfjs =
        await import(
            "pdfjs-dist/legacy/build/pdf.mjs"
        );

    return await pdfjs.getDocument({

        data:new Uint8Array(buffer),

        useSystemFonts:true,

    }).promise;

}
