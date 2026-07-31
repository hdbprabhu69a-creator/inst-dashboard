import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(){

  const u = await getDocs(
    query(
      collection(db,"universe"),
      where("symbol","==","ABCAPITAL")
    )
  );

  if(u.empty){
    return NextResponse.json({success:false});
  }

  const stock=u.docs[0];

  const h=await getDocs(
    collection(
      db,
      "universe",
      stock.id,
      "history"
    )
  );

  return NextResponse.json(
    h.docs
      .slice(0,10)
      .map(d=>({
        id:d.id,
        data:d.data()
      }))
  );
}

