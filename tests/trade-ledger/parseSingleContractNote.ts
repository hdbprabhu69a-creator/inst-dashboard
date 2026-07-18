import {parseSingleContractNote}
from "../../lib/trade-ledger/parser/parseSingleContractNote";

async function main(){

    const note=

        await parseSingleContractNote(

            "data/trade-ledger/contract.pdf"

        );

    console.dir(

        note,

        {depth:null}

    );

}

main();
