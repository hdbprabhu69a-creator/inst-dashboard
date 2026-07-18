import {loadPdf} from "../../lib/trade-ledger/pdf/pdfLoader";
import {extractPageItems} from "../../lib/trade-ledger/pdf/pageExtractor";
import {extractTradeRows} from "../../lib/trade-ledger/pdf/tableExtractor";

async function main(){

    const pdf=await loadPdf("data/trade-ledger/contract.pdf");

    const page=await pdf.getPage(6);

    const items=await extractPageItems(page);

    const rows=extractTradeRows(items);

    console.table(rows);

}

main().catch(console.error);
