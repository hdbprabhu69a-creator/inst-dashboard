import { NextResponse } from "next/server";
import { getUniverse } from "@/institutional-analysis/repository/universeRepository";

export async function GET(request:Request){

  try{

    const universe=await getUniverse();

    const rows:any[]=[];

    for(const stock of universe){

      if(!stock.symbol) continue;

      if(
        stock.symbol==="NIFTY" ||
        stock.symbol==="BANKNIFTY" ||
        stock.symbol.startsWith("NIFTY")
      ){
        continue;
      }

      try{

        const url=new URL(request.url);

        url.pathname="/api/institutional-analysis/volume";

        url.searchParams.set("symbol",stock.symbol);

        const r=await fetch(url.toString(),{
          cache:"no-store"
        });

        if(!r.ok) continue;

        const j=await r.json();

        if(!j.success) continue;

        rows.push({

          symbol:stock.symbol,

          ...(j.data??{})

        });

      }catch{}

    }

    rows.sort(
      (a,b)=>a.symbol.localeCompare(b.symbol)
    );

    return NextResponse.json({

      success:true,

      count:rows.length,

      data:rows

    });

  }catch(e:any){

    return NextResponse.json({

      success:false,

      error:e.message

    },{

      status:500

    });

  }

}


