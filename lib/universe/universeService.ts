import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UniverseStock } from "./types";

let cache: UniverseStock[] | null = null;

export async function getUniverse(): Promise<UniverseStock[]> {
  if (cache) return cache;
  const snap = await getDocs(collection(db, "universe"));
  cache = snap.docs.map(doc => ({ symbol: doc.id, ...doc.data() })) as UniverseStock[];
  return cache;
}

export function clearUniverseCache() {
  cache = null;
}
