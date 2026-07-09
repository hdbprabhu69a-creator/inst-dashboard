import fs from "node:fs";
import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";

async function main(){

    const pages=await extractPageText(process.argv[2]);

    fs.mkdirSync("output",{recursive:true});

    for(const page of pages){

        fs.writeFileSync(
            `output/page-${page.page}.txt`,
            page.text
        );

    }

    console.log("DONE");

}

main().catch(console.error);
