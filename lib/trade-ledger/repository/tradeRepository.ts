import {adminDb} from "@/lib/firebase-admin";
import type {ContractNote} from "../contractNoteTypes";

const COLLECTION="contract_trades";

function buildDocumentId(
    value:string
):string{

    return value.replace(/[\/\\.#$\[\]]/g,"_");

}

export async function saveTrades(
    note:ContractNote
):Promise<void>{

    const batch=adminDb.batch();

    for(const trade of note.trades){

        const id=`${buildDocumentId(note.header.contractNoteNo)}_${trade.tradeNo}_${trade.orderNo}`;

        const ref=adminDb
            .collection(COLLECTION)
            .doc(id);

        batch.set(ref,{

            contractNoteNo:note.header.contractNoteNo,

            tradeDate:note.header.tradeDate,

            settlementNo:note.header.settlementNo,

            settlementDate:note.header.settlementDate,

            clientId:note.header.clientId,

            clientName:note.header.clientName,

            summary:note.summary,

            charges:note.charges,

            importedAt:Date.now(),

            ...trade

        });

    }

    await batch.commit();

}

