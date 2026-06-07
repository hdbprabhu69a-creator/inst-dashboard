import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

let universeCache: any[] = [];

export async function getUniverseStocks() {

  if (
    universeCache.length > 0
  ) {

    return universeCache;

  }

  const snapshot =
    await getDocs(
      collection(
        db,
        "universe"
      )
    );

  universeCache =
    snapshot.docs.map(
      (doc) => ({

        id: doc.id,

        ...doc.data(),

      })
    );

  return universeCache;

}