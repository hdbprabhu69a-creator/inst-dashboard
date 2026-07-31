import { NextResponse } from "next/server";
import { KiteConnect } from "kiteconnect";
import { adminDb } from "@/lib/firebase-admin";

const SECTORS = [
  { name:"BANK", token:"260105" },
  { name:"IT", token:"259849" },
  { name:"REALTY", token:"261129" },
  { name:"ENERGY", token:"261641" },
  { name:"FMCG", token:"261897" },
  { name:"PHARMA", token:"262409" },
  { name:"PSU BANK", token:"262921" },
  { name:"AUTO", token:"263433" },
  { name:"METAL", token:"263689" },
  { name:"MEDIA", token:"263945" },
  { name:"OIL & GAS", token:"289033" }
];

export async function GET() {

  try {

    const tokenDoc = await adminDb
      .collection("settings")
      .doc("kite")
      .get();

    const accessToken =
      tokenDoc.data()?.accessToken;

    const kite = new KiteConnect({
      api_key: process.env.KITE_API_KEY!,
    });

    kite.setAccessToken(accessToken);

    const symbols = SECTORS.map(
      s => `NSE:${s.name === "OIL & GAS" ? "NIFTY OIL AND GAS" : "NIFTY " + s.name}`
    );

    const quotes = await kite.getQuote(symbols);

    const data = SECTORS.map(sector => {

      const key =
        `NSE:${sector.name === "OIL & GAS" ? "NIFTY OIL AND GAS" : "NIFTY " + sector.name}`;

      const q:any = quotes[key];

      return {

        sector: sector.name,

        token: sector.token,

        lastPrice: q?.last_price ?? 0,

        change: q?.net_change ?? 0,

        previousClose:q?.ohlc?.close ?? 0,

        changePercent:q?.ohlc?.close
          ? Number((((q.last_price-q.ohlc.close)/q.ohlc.close)*100).toFixed(2))
          :0,

        direction:
          (q?.last_price??0)>=(q?.ohlc?.close??0)
            ?"UP"
            :"DOWN",

        strength:
          !q?.ohlc?.close
            ?"UNKNOWN"
            :(((q.last_price-q.ohlc.close)/q.ohlc.close)*100)>=1
              ?"STRONG"
              :(((q.last_price-q.ohlc.close)/q.ohlc.close)*100)>=0
                ?"POSITIVE"
                :(((q.last_price-q.ohlc.close)/q.ohlc.close)*100)>=-1
                  ?"WEAK"
                  :"VERY_WEAK"

      };

    })
    .sort((a,b)=>b.changePercent-a.changePercent)
    .map((row,index)=>({

      ...row,

      rank:index+1

    }));

    return NextResponse.json({

      success:true,

      data

    });

  }

  catch(error:any){

    return NextResponse.json({

      success:false,

      error:error.message

    },{

      status:500

    });

  }

}


