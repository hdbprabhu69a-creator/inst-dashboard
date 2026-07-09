import {extractPageText} from "../lib/newspaper/parser/ocrPdfParser";
import {buildRows} from "../lib/newspaper/parser/layoutBuilder";
import {splitArticles} from "../lib/newspaper/parser/articleSegmenter";

async function main(){

    const pdf=process.argv[2];

    if(!pdf){

        throw new Error("PDF path missing");

    }

    const pages=await extractPageText(pdf);

    console.log("");
    console.log("========================================");
    console.log(" BUSINESSLINE ARTICLE TEST");
    console.log("========================================");

    for(const page of pages){

        const rows=buildRows(page.items);

        const text=rows
            .map(r=>r.text)
            .join("\n");

        const articles=splitArticles(
            page.page,
            text
        );

        console.log("");
        console.log("========================================");
        console.log(`PAGE ${page.page}`);
        console.log("========================================");
        console.log(`Rows      : ${rows.length}`);
        console.log(`Articles  : ${articles.length}`);

        articles.forEach((a,i)=>{

            console.log("");
            console.log(`${i+1}. ${a.headline}`);
            console.log("----------------------------------------");
            console.log(
                a.body.substring(0,250)
            );

        });

    }

}

main().catch(console.error);
