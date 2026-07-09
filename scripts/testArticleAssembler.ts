import {extractPdfText} from "../lib/newspaper/parser/pdfTextParser";
import {assembleArticles} from "../lib/newspaper/parser/articleAssembler";

async function main(){

    const file=process.argv[2];

    if(!file){

        throw new Error("PDF path missing");

    }

    const pages=await extractPdfText(file);

    for(const page of pages){

        console.log("");
        console.log("========================================");
        console.log(`PAGE ${page.page}`);
        console.log("========================================");

        const articles=assembleArticles(
            page.page,
            page.text
        );

        console.log("Articles :",articles.length);

        articles.forEach((a,i)=>{

            console.log("");
            console.log(`${i+1}. ${a.headline}`);
            console.log("----------------------------------------");
            console.log(a.body.substring(0,300));

        });

    }

}

main().catch(console.error);
