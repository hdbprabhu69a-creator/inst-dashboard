import fs from "node:fs";
import path from "node:path";

import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";
import { splitArticles } from "../lib/newspaper/parser/articleSegmenter";

async function main(){

    const pdf=process.argv[2];

    if(!pdf){
        throw new Error("PDF path missing.");
    }

    const pages=await extractPageText(pdf);

    const articles=[];

    for(const page of pages){

        articles.push(
            ...splitArticles(
                page.page,
                page.text
            )
        );

    }

    fs.mkdirSync("output",{
        recursive:true
    });

    fs.writeFileSync(
        path.join(
            "output",
            "articles.json"
        ),
        JSON.stringify(
            articles,
            null,
            2
        )
    );

    console.log("");
    console.log("================================");
    console.log(" Articles Exported");
    console.log("================================");
    console.log(`Articles : ${articles.length}`);
    console.log("output/articles.json");

}

main().catch(console.error);
