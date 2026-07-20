import {parseSingleContractNote} from "../../lib/trade-ledger/parser/parseSingleContractNote";

async function main(){

    const note=await parseSingleContractNote(
        "G:\\GProjects\\inst-dashboard\\BC0109_2026-07-16_2026-07-16.pdf"
    );

    console.dir(note,{depth:null});

}

main().catch(console.error);
