import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getHistoryData(
  stockId: string
) {

  const snapshot = await getDocs(

    query(

      collection(
        db,
        "universe",
        stockId,
        "history"
      ),

      orderBy(
        "date",
        "asc"
      )

    )

  );

  return snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );

}
