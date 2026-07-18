import fs from "node:fs";

import {normalizeAnnexureText} from "../../lib/trade-ledger/parser/normalizeAnnexureText";
import {parseAnnexureRow} from "../../lib/trade-ledger/parser/annexureRowParser";

const text=fs.readFileSync("contract-note.txt","utf8");

const normalized=normalizeAnnexureText(text);

const rows=normalized.split(/\r?\n/);

for(const row of rows){

  const parsed=parseAnnexureRow(row);

  if(parsed){

    console.log(parsed);

  }

}
