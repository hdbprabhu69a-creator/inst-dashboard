import {
 analyzePattern
} from "./patternEngine";


import {
 analyzePatternLifecycle
} from "./patternLifecycleEngine";



export async function scanPatternUniverse(

 universe:any[]

){


 const results:any[]=[];


 for(const stock of universe){


  const candles =
    stock.candles;


  if(
    !candles ||
    candles.length < 50
  )
    continue;



  const cmp =
    candles[
      candles.length-1
    ].close;



  const patterns =
    analyzePattern(
      candles
    );


  if(!patterns)
    continue;



  const lifecycle =
    analyzePatternLifecycle(

      candles,

      patterns,

      cmp

    );



  results.push({

    symbol:
      stock.symbol,

    cmp,


    completedPattern:
      lifecycle.completedPattern,


    currentFormation:
      lifecycle.currentFormation


  });


 }


 return results;


}
