import {extractPdfText} from "../lib/newspaper/parser/pdfTextParser";
import {assembleArticles} from "../lib/newspaper/parser/articleAssembler";
import {mergeFragments} from "../lib/newspaper/parser/fragmentMerger";

async function main(){

    const file=process.argv[2];

    const pages=await extractPdfText(file);

    for(const page of pages){

        const raw=assembleArticles(
            page.page,
            page.text
        );

        const merged=mergeFragments(raw);

        console.log("");

        console.log("========================================");
        console.log(`PAGE ${page.page}`);
        console.log("========================================");

        console.log("Raw Articles    :",raw.length);
        console.log("Merged Articles :",merged.length);

        merged.forEach((a,i)=>{

            console.log("");

            console.log(`${i+1}. ${a.headline}`);

            console.log("----------------------------------------");

            console.log(
                a.body.substring(0,350)
            );

        });

    }

}

main().catch(console.error);
