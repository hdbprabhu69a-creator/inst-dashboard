import { parseSingleContractNote } from "./lib/trade-ledger/parser/parseSingleContractNote";

const note = await parseSingleContractNote(process.argv[2]);

console.dir(note.summary, { depth: null });
