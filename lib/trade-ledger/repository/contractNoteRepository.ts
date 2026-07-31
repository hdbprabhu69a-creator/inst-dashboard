import { adminDb } from "@/lib/firebase-admin";
import type { ContractNote } from "../contractNoteTypes";

const COLLECTION = "contract_notes";

function buildDocumentId(
    contractNoteNo: string
): string {

    return contractNoteNo.replace(/[\/\\.#$\[\]]/g, "_");

}

export async function saveContractNote(
    note: ContractNote,
    sourceFile: string
): Promise<void> {

    await adminDb
        .collection(COLLECTION)
        .doc(buildDocumentId(note.header.contractNoteNo))
        .set({

            header: note.header,

            summary: note.summary,

            charges: note.charges,

            sourceFile,

            importedAt: Date.now()

        });

}

