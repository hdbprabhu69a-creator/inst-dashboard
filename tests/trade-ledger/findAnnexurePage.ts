import { loadPdf } from "../../lib/trade-ledger/pdf/pdfLoader";
import { extractPageItems } from "../../lib/trade-ledger/pdf/pageExtractor";

async function main(){

    const pdf = await loadPdf("data/trade-ledger/contract.pdf");

    console.log("Pages:", pdf.numPages);

    for(let i=1;i<=pdf.numPages;i++){

        const page=await pdf.getPage(i);

        const items=await extractPageItems(page);

        const text=items.map(x=>x.text).join(" ");

        if(text.includes("Annexure A")){

            console.log("Annexure on page",i);

        }

    }

}

main();
