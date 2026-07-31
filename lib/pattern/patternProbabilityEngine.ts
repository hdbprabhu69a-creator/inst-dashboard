export function scoreFuturePattern(
 patterns:any[],
 features:any
){

 return patterns

 .map(pattern=>{


 let score = 0;


 // pattern confidence
 score +=
   pattern.confidence * 0.4;


 // base compression
 score +=
   features.compression * 0.2;


 // trend alignment
 score +=
   features.trend * 0.2;


 // volume confirmation
 score +=
   features.volume * 0.2;



 return {

  pattern:
   pattern.pattern,


  probability:
   Math.min(
    Math.round(score),
    100
   ),


  breakout:
   pattern.breakout,


  target:
   pattern.target

 };


 })

 .sort(
 (a,b)=>
 b.probability -
 a.probability
 );


}

