import fs from "node:fs";

import {normalizeAnnexureText} from "../../lib/trade-ledger/parser/normalizeAnnexureText";

const text=fs.readFileSync("contract-note.txt","utf8");

const start=text.indexOf("Annexure A");

const sample=text.substring(start,start+3000);

console.log(normalizeAnnexureText(sample));
