import fs from "node:fs";

import {extractSection} from "../../lib/trade-ledger/parser/extractSection";

const text=fs.readFileSync("contract-note.txt","utf8");

const annexure=extractSection(
  text,
  /ANNEXURE/i,
  /SUMMARY/i
);

console.log(annexure);


