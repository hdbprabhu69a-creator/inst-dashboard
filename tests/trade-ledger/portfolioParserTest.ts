import fs from "node:fs";

import {parseTradeLedger} from "../../lib/trade-ledger/parser/tradeLedgerParser";

const text=fs.readFileSync("contract-note.txt","utf8");

const notes=parseTradeLedger(text);

console.log("Contract Notes :",notes.length);

for(const note of notes){

  console.log("----------------------------");

  console.log(
    note.trades[0]?.tradeDate
  );

  console.log(
    "Trades:",
    note.trades.length
  );

  console.log(
    "Charges:",
    note.charges
  );

}
