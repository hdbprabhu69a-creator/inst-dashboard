import {extractPdfText} from "../lib/newspaper/parser/pdfTextParser";
import {parseMetadata} from "../lib/newspaper/parser/metadataParser";

async function main(){

    const file=process.argv[2];

    if(!file){

        throw new Error("PDF path missing");

    }

    const pages=await extractPdfText(file);

    const meta=parseMetadata(pages[0].text);

    console.log("");
    console.log("==========================================");
    console.log(" BUSINESSLINE METADATA TEST");
    console.log("==========================================");

    console.log(meta);

}

main().catch(console.error);
