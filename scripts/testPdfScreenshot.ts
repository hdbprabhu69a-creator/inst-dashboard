import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

async function main(){

    const pdfFile=process.argv[2];

    if(!pdfFile){
        throw new Error(
            "Usage: npx tsx scripts/testPdfScreenshot.ts <pdf>"
        );
    }

    const buffer=await fs.readFile(pdfFile);

    const parser=new PDFParse({
        data:new Uint8Array(buffer)
    });

    try{

        const result=await parser.getScreenshot({

            first:1,
            last:1,
            scale:2,
            imageBuffer:true

        });

        if(result.pages.length===0){
            throw new Error("No screenshot returned.");
        }

        const page=result.pages[0];

        const output=path.resolve(
            "output",
            "page-1.png"
        );

        await fs.mkdir(
            path.dirname(output),
            {
                recursive:true
            }
        );

        await fs.writeFile(
            output,
            Buffer.from(page.data)
        );

        console.log("");
        console.log("================================");
        console.log(" BUILD-012 SCREENSHOT SUCCESS");
        console.log("================================");
        console.log("");
        console.log(output);

    }
    finally{

        await parser.destroy();

    }

}

main().catch(console.error);
