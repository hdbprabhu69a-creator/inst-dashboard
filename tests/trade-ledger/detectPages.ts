import {loadPdf} from "../../lib/trade-ledger/pdf/pdfLoader";
import {extractPageItems} from "../../lib/trade-ledger/pdf/pageExtractor";
import {detectPageType} from "../../lib/trade-ledger/parser/pageType";

async function main(){

    const pdf=await loadPdf(
        "data/trade-ledger/contract.pdf"
    );

    for(

        let i=1;

        i<=pdf.numPages;

        i++

    ){

        const page=await pdf.getPage(i);

        const items=await extractPageItems(page);

        const text=items
            .map(x=>x.text)
            .join(" ");

        console.log(
            i,
            detectPageType(text)
        );

    }

}

main();
