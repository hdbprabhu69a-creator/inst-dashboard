import fs from "node:fs";

import {parseTradeLedger} from "../../lib/trade-ledger/parser/tradeLedgerParser";
import {exportTradesToExcel} from "../../lib/trade-ledger/export/exportTradesToExcel";

async function run(){

  const text=fs.readFileSync("contract-note.txt","utf8");

  const notes=parseTradeLedger(text);

  await exportTradesToExcel(

    notes,

    "Trades.xlsx"

  );

  console.log("Trades.xlsx created");

}

run();
