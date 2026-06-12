import {
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

async function clearUniverse() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "universe"
      )
    );

  for (const docItem of snapshot.docs) {

    await deleteDoc(
      docItem.ref
    );

    console.log(
      "Deleted:",
      docItem.id
    );

  }

  console.log(
    "Universe Cleared"
  );

}

clearUniverse();