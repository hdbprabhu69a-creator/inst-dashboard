export type MarketState =
  | "Accumulation"
  | "Compression"
  | "Expansion"
  | "Markup"
  | "Distribution"
  | "Markdown"
  | "Unknown";


export type HistoryRow = {

  date:string;

  open:number;

  high:number;

  low:number;

  close:number;

  volume:number;

};



function average(
 values:number[]
){

 if(values.length===0)
  return 0;


 return (
  values.reduce(
   (a,b)=>a+b,
   0
  )
  /
  values.length
 );

}



export function detectMarketState(
 history:HistoryRow[]
):MarketState {


 if(history.length < 30)
   return "Unknown";



 const recent =
   history.slice(-30);



 const closes =
   recent.map(
    c=>c.close
   );


 const volumes =
   recent.map(
    c=>c.volume
   );



 const first =
   closes[0];


 const last =
   closes[closes.length-1];



 const change =
   ((last-first)/first)*100;



 const avgVolume =
   average(
    volumes
   );



 const lastVolume =
   volumes[volumes.length-1];



 const range =
   Math.max(
    ...recent.map(
     c=>c.high
    )
   )
   -
   Math.min(
    ...recent.map(
     c=>c.low
    )
   );



 const avgRange =
   average(
    recent.map(
     c=>c.high-c.low
    )
   );



 if(
   range < avgRange * 8 &&
   Math.abs(change) < 3
 )
   return "Compression";



 if(
   lastVolume > avgVolume * 1.5 &&
   change > 3
 )
   return "Expansion";



 if(
   change > 5
 )
   return "Markup";



 if(
   change < -5
 )
   return "Markdown";



 if(
   Math.abs(change) < 3 &&
   lastVolume > avgVolume
 )
   return "Accumulation";



 if(
   change < -3
 )
   return "Distribution";



 return "Unknown";

}