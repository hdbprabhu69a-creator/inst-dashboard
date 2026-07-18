import {loadPdf} from "../../lib/trade-ledger/pdf/pdfLoader";

async function main(){

    const pdf=await loadPdf(
        "data/trade-ledger/contract.pdf"
    );

    console.log("Pages:",pdf.numPages);

}

main();
