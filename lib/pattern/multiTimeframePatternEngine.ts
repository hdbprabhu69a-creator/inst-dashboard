import {
  analyzePattern
} from "./patternEngine";


export type PatternTimeframe =
 | "DAILY"
 | "WEEKLY"
 | "MONTHLY";


export interface MTFPatternResult {

 timeframe:string;

 pattern:string;

 confidence:number;

 stage:string;

 breakout:number;

 stoploss:number;

 target:number;

}



export function analyzeMultiTimeframePattern(

 daily:any[],

 weekly:any[],

 monthly:any[],

 currentPrice:number

):MTFPatternResult[] {


 const results:MTFPatternResult[]=[];


 const scans=[

  {
   timeframe:"DAILY",
   candles:daily
  },

  {
   timeframe:"WEEKLY",
   candles:weekly
  },

  {
   timeframe:"MONTHLY",
   candles:monthly
  }

 ];



 for(const scan of scans){


  const candles =
   scan.candles.slice(-200);



  const pattern =
   analyzePattern(
    candles
   );


  if(!pattern)
   continue;



  const distance =

   Math.abs(
    pattern.breakout -
    currentPrice
   )
   /
   currentPrice;



  // ignore old patterns
  if(distance > 0.10)
    continue;



  results.push({

   timeframe:
    scan.timeframe,

   pattern:
    pattern.pattern,

   confidence:
    pattern.confidence,

   stage:
    "FORMING",

   breakout:
    pattern.breakout,

   stoploss:
    pattern.stoploss,

   target:
    pattern.target

  });


 }



 return results;

}

