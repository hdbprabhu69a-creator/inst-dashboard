import {extractPdfText} from "../lib/newspaper/parser/pdfTextParser";
import {splitIntoBlocks} from "../lib/newspaper/parser/textBlocks";

async function main(){

    const file=process.argv[2];

    if(!file){

        throw new Error("PDF path missing");

    }

    const pages=await extractPdfText(file);

    console.log("");
    console.log("==========================================");
    console.log(" BUSINESSLINE BLOCK TEST");
    console.log("==========================================");

    for(const page of pages){

        console.log("");
        console.log(`PAGE ${page.page}`);
        console.log("------------------------------------------");

        const blocks=splitIntoBlocks(page.text);

        console.log(`Blocks : ${blocks.length}`);

        blocks.forEach((b,i)=>{

            console.log("");
            console.log(`BLOCK ${i+1}`);
            console.log("------------------------------------------");
            console.log(b.substring(0,500));

        });

    }

}

main().catch(console.error);
