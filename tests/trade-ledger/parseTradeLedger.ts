import { parseTradeLedger } from "../../lib/trade-ledger/parser/parseTradeLedger";

async function main() {

    const pdfPath =
        process.argv[2] ??
        "data/trade-ledger/contract.pdf";

    console.log("Parsing:", pdfPath);

    const trades = await parseTradeLedger(pdfPath);

    console.table(trades);

}

main().catch(console.error);
