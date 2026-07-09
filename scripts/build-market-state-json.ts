import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";

async function main() {

  const { adminDb } = await import("@/lib/firebase-admin");

  const snapshot = await adminDb
    .collection("universe")
    .get();

  const rows = snapshot.docs.map((doc:any) => {

    const s = doc.data();

    return {
      id: doc.id,
      symbol: s.symbol ?? "",
      sector: s.sector ?? "",
      state: "Pending",
      score: 0,
      confidence: 0,
      strength: "",
      previousState: "",
      nextState: "",
      duration: 0,
      updatedAt: "",
    };

  });

  fs.writeFileSync(
    "marketState.json",
    JSON.stringify(rows, null, 2)
  );

  console.log(`Created marketState.json`);
  console.log(`Stocks: ${rows.length}`);
}

main().catch(console.error);
