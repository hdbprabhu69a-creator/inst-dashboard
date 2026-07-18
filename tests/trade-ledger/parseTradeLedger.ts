import {parseTradeLedger} from "../../lib/trade-ledger/parser/parseTradeLedger";

async function main(){

    const trades=await parseTradeLedger(
        "data/trade-ledger/contract.pdf"
    );

    console.table(trades);

}

main().catch(console.error);
