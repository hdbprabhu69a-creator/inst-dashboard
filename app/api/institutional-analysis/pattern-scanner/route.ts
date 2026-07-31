import {
 NextResponse
} from "next/server";


import {
 collection,
 getDocs
} from "firebase/firestore";


import {
 db
} from "@/lib/firebase";


import {
 scanPatternUniverse
} from "@/lib/pattern/universePatternScanner";



export async function GET(){


try{


 const snap =
  await getDocs(
   collection(
    db,
    "universe"
   )
  );



 const stocks =
  snap.docs.map(
   d=>({

    symbol:
     d.data().symbol,

    id:
     d.id

   })
  );



 const universe:any[]=[];



 for(
  const stock of stocks
 ){


  const historySnap =
   await getDocs(
    collection(

     db,

     "universe",

     stock.id,

     "history"

    )
   );


  const candles =
   historySnap.docs

   .map(
    d=>d.data()
   )

   .sort(
    (a:any,b:any)=>
    a.date.localeCompare(
     b.date
    )
   );


  universe.push({

    symbol:
     stock.symbol,

    candles

  });


 }



 const results =
  await scanPatternUniverse(
    universe
  );



 return NextResponse.json({

  success:true,

  total:
   results.length,

  data:
   results

 });


}
catch(e:any){


 return NextResponse.json({

  success:false,

  error:e.message

 },{
  status:500
 });


}


}

