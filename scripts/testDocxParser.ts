import {extractDocxText} from "../lib/newspaper/parser/docxParser";

async function main(){

    const file=process.argv[2];

    if(!file){

        throw new Error("DOCX path missing.");

    }

    const pages=await extractDocxText(file);

    console.log("");
    console.log("========================================");
    console.log(" DOCX PARSER TEST");
    console.log("========================================");
    console.log("Pages :",pages.length);

    for(const page of pages){

        console.log("");
        console.log("========================================");
        console.log("PAGE",page.page);
        console.log("========================================");

        console.log(page.text.substring(0,1000));

    }

}

main().catch(console.error);
