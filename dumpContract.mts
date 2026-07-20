import { parseSingleContractNote } from "./lib/trade-ledger/parser/parseSingleContractNote";

const pdfPath = process.argv[2];

const note = await parseSingleContractNote(pdfPath);

console.dir(note, { depth: null });
