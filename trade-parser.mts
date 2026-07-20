import { parseSingleContractNote } from "./lib/trade-ledger/parser/parseSingleContractNote.js";

const pdfPath = process.argv[2];

if (!pdfPath) {
    console.error("Missing pdf path");
    process.exit(1);
}

try {

    const note = await parseSingleContractNote(pdfPath);

    console.log(JSON.stringify(note));

} catch (err) {

    console.error(err);

    process.exit(1);

}
