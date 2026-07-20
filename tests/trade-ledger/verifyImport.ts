import { adminDb } from "../../lib/firebase-admin";

async function main(){

    console.log("\n=== CONTRACT NOTES ===\n");

    const notes=await adminDb
        .collection("contract_notes")
        .limit(10)
        .get();

    notes.forEach((doc:any)=>{

        const d=doc.data();

        console.log({

            id:doc.id,

            contractNoteNo:d.header?.contractNoteNo,

            tradeDate:d.header?.tradeDate,

            settlement:d.header?.settlementNumber,

            sourceFile:d.sourceFile

        });

    });

    console.log("\n=== RECENT TRADES ===\n");

    const trades=await adminDb
        .collection("contract_trades")
        .orderBy("tradeDate","desc")
        .limit(20)
        .get();

    trades.forEach((doc:any)=>{

        const d=doc.data();

        console.log({

            id:doc.id,

            symbol:d.symbol,

            side:d.side,

            quantity:d.quantity,

            price:d.price,

            tradeDate:d.tradeDate

        });

    });

}

main().catch(console.error);
