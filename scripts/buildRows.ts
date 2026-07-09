import fs from "node:fs";
import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";
import { buildRows } from "../lib/newspaper/parser/layoutBuilder";

async function main(){

    const pdf=process.argv[2];

    if(!pdf){
        throw new Error("PDF path missing.");
    }

    const pages=await extractPageText(pdf);

    fs.mkdirSync("output",{recursive:true});

    const rows=buildRows(pages[0].items);

    fs.writeFileSync(
        "output/page-1-rows.json",
        JSON.stringify(rows,null,2)
    );

    console.log("");
    console.log("================================");
    console.log(" Rows Generated");
    console.log("================================");
    console.log(`Rows : ${rows.length}`);
    console.log("output/page-1-rows.json");

}

main().catch(console.error);
