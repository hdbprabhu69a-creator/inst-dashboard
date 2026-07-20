import { parseSingleContractNote } from "../parser/parseSingleContractNote";
import { saveContractNote } from "../repository/contractNoteRepository";
import { saveTrades } from "../repository/tradeRepository";

const pdfPath = process.argv[2];

if (!pdfPath) {
    throw new Error("PDF path missing.");
}

async function run() {

    const note = await parseSingleContractNote(pdfPath);

    await saveContractNote(
        note,
        pdfPath
    );

    await saveTrades(
        note
    );

    console.log(JSON.stringify({

        success: true,

        contractNoteNo: note.header.contractNoteNo,

        trades: note.trades.length

    }));

}

run().catch(error => {

    console.error(error);

    process.exit(1);

});
