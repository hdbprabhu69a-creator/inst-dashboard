import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getHistory(symbol:string){
  const ref = doc(db,"priceHistory",symbol);
  const snap = await getDoc(ref);

  if(!snap.exists()){
    return [];
  }

  const data = snap.data();
  return data.dailyCandles ?? [];
}
