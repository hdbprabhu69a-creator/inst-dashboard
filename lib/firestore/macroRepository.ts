import {adminDb} from "@/lib/firebase-admin";
import {MacroRow} from "@/types/macro";

const COLLECTION="india_macro";

export async function getMacroRows():Promise<MacroRow[]>{

    const snapshot=await adminDb.collection(COLLECTION).get();

    return snapshot.docs.map(doc=>({

        id:doc.id,

        ...(doc.data() as Omit<MacroRow,"id">)

    }));

}

export async function saveMacroRow(row:MacroRow){

    await adminDb
        .collection(COLLECTION)
        .doc(row.id)
        .set(row);

}

export async function saveAllMacroRows(rows:MacroRow[]){

    const batch=adminDb.batch();

    rows.forEach(row=>{

        batch.set(

            adminDb.collection(COLLECTION).doc(row.id),

            row

        );

    });

    await batch.commit();

}
