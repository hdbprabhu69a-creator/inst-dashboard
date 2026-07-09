import fs from "node:fs";
import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";

async function main(){

    const pages=await extractPageText(process.argv[2]);

    fs.mkdirSync("output",{recursive:true});

    fs.writeFileSync(
        "output/page-1-layout.json",
        JSON.stringify(
            pages[0],
            null,
            2
        )
    );

    console.log("");
    console.log("==============================");
    console.log(" Layout JSON Created");
    console.log("==============================");
    console.log("output/page-1-layout.json");

}

main().catch(console.error);
