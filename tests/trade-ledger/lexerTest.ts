import fs from "node:fs";
import {AnnexureLexer} from "../../lib/trade-ledger/tokenizer/annexureLexer";

const text=fs.readFileSync("contract-note.txt","utf8");

const tokens=new AnnexureLexer(text).tokenize();

console.table(tokens.slice(0,100));
