export function getPatternStatus(

 cmp:number,

 breakout:number,

 targets:any,

 stoploss:number

){


 if(
  cmp <= stoploss
 )
 return "FAILED";


 if(
  cmp >= targets.T3
 )
 return "T3_ACHIEVED";


 if(
  cmp >= targets.T2
 )
 return "T2_ACHIEVED";


 if(
  cmp >= targets.T1
 )
 return "T1_ACHIEVED";


 if(
  Math.abs(
   cmp-breakout
  ) /
  breakout < 0.03
 )
 return "READY";


 if(
  cmp > breakout
 )
 return "ACTIVE";


 return "FORMING";

}
