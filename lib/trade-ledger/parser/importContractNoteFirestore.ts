import { parseSingleContractNote } from "./parseSingleContractNote";
import { validateContractNote } from "./validateContractNote";

import { saveContractNote } from "../repository/contractNoteRepository";
import { saveTrades } from "../repository/tradeRepository";

export async function importContractNoteFirestore(
    pdfPath:string
){

    const note=
        await parseSingleContractNote(
            pdfPath
        );

    const validation=
        validateContractNote(
            note
        );

    if(!validation.valid){

        return{

            success:false,

            validation,

            note

        };

    }

    await saveContractNote(

        note,

        pdfPath

    );

    await saveTrades(
        note
    );

    return{

        success:true,

        note

    };

}
