import {extractPdfText} from "../lib/newspaper/parser/pdfTextParser";

async function main(){

    const file=process.argv[2];

    if(!file){

        throw new Error("PDF path missing");

    }

    const pages=await extractPdfText(file);

    console.log("");
    console.log("====================================");
    console.log("SEARCHABLE PDF PARSER");
    console.log("====================================");
    console.log("Pages :",pages.length);

    for(const page of pages){

        console.log("");
        console.log(`PAGE ${page.page}`);
        console.log("------------------------------------");
        console.log(page.text.substring(0,1500));

    }

}

main().catch(console.error);
