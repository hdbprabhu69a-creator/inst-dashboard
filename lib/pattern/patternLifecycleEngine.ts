import {
 detectBase
} from "./baseFormationEngine";


import {
 scoreFuturePattern
} from "./patternProbabilityEngine";


import {
 projectPatternTargets
} from "./targetProjectionEngine";



export function analyzePatternLifecycle(

 candles:any[],

 pattern:any,

 currentPrice:number

){

 const base =
  detectBase(
    candles
  );


 const height =
  Math.abs(
    pattern.breakout -
    pattern.stoploss
  );


 const targets =
  projectPatternTargets(
    pattern.pattern,
    pattern.breakout,
    height
  );


 return {


 completedPattern:{

   pattern:
    pattern.pattern,

   breakout:
    pattern.breakout,

   targets,

   status:
    currentPrice >= targets.T1
    ?
    "TARGET_ACHIEVED"
    :
    "ACTIVE"

 },


 currentFormation:{

   base,

   nextPatternProbability:
    scoreFuturePattern(

      [
        pattern
      ],

      {

        structure:
          70,

        compression:
          base.height < (base.baseHigh * 0.10)
          ? 80
          : 50,

        volume:
          60,

        trend:
          70

      }

    )
 }


 };

}





