import { adminDb } from "@/lib/firebase-admin";

async function main() {

    const universe = await adminDb
        .collection("universe")
        .where("symbol","==","SBIN")
        .limit(1)
        .get();

    console.log("Documents Found:", universe.size);

    if (universe.empty) {
        console.log("SBIN not found.");
        return;
    }

    const doc = universe.docs[0];

    console.log("Document ID:", doc.id);

    const history = await doc.ref
        .collection("history")
        .orderBy("date","asc")
        .get();

    console.log("Candles:", history.size);

    if (history.size > 0) {
        console.log("First:", history.docs[0].data());
        console.log("Last :", history.docs[history.size - 1].data());
    }

}

main().catch(console.error);
