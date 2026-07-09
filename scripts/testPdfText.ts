import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";

async function main(){

    const pdfFile=process.argv[2];

    if(!pdfFile){
        throw new Error(
            "Usage: npx tsx scripts/testPdfText.ts <pdf>"
        );
    }

    const buffer=await fs.readFile(pdfFile);

    const parser=new PDFParse({
        data:new Uint8Array(buffer)
    });

    try{

        const text=await parser.getText();

        console.log("");
        console.log("================================");
        console.log(" BUILD-012 PDF PARSE SUCCESS");
        console.log("================================");
        console.log("");

        console.log("Pages :",text.pages.length);
        console.log("");

        console.log(
            text.text.substring(0,3000)
        );

    }
    finally{

        await parser.destroy();

    }

}

main().catch(console.error);
