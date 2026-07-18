import {loadPdf} from "../../lib/trade-ledger/pdf/pdfLoader";
import {extractPageItems} from "../../lib/trade-ledger/pdf/pageExtractor";

async function main(){

    const pdf=await loadPdf("data/trade-ledger/contract.pdf");

    for(const pageNo of [1,7,13,19,25,31,37,43,49,55,61,67]){

        const page=await pdf.getPage(pageNo);

        const items=await extractPageItems(page);

        console.log("\n===== PAGE",pageNo,"=====");

        console.log(
            items
                .slice(0,40)
                .map(x=>x.text)
                .join(" ")
        );

    }

}

main();
