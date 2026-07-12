import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function main() {

  const snap = await getDocs(collection(db,"universe"));

  for (const d of snap.docs) {
    const x = d.data();
    console.log({
      id: d.id,
      symbol: x.symbol,
      token: x.instrumentToken
    });
  }

}

main().catch(console.error);
