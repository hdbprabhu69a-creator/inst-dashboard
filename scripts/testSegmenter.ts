import { extractPageText } from "../lib/newspaper/parser/ocrPdfParser";
import { splitArticles } from "../lib/newspaper/parser/articleSegmenter";

async function main(){

    const pdf=process.argv[2];

    if(!pdf){
        console.error("Usage:");
        console.error('npx tsx scripts\\testSegmenter.ts "<pdf>"');
        process.exit(1);
    }

    const pages=await extractPageText(pdf);

    for(const page of pages){

        const articles=splitArticles(
            page.page,
            page.text
        );

        console.log("");
        console.log("================================");
        console.log(`PAGE ${page.page}`);
        console.log(`ARTICLES : ${articles.length}`);
        console.log("================================");

        for(const a of articles){

            console.log("");
            console.log("HEADLINE:");
            console.log(a.headline);

            console.log("");

            console.log(
                a.body.substring(0,250)
            );

            console.log("--------------------------------");

        }

    }

}

main().catch(console.error);
