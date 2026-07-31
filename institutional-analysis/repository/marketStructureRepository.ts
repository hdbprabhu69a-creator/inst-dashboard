import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getMarketStructure(symbol:string){

  const snap=await getDoc(
    doc(db,"marketStructure",symbol)
  );

  return snap.exists()?snap.data():null;

}

export async function updateEngine(
  symbol:string,
  engine:string,
  payload:any
){

  await setDoc(

    doc(db,"marketStructure",symbol),

    {
      [engine]:payload,
      updatedAt:new Date().toISOString()
    },

    {
      merge:true
    }

  );

}

