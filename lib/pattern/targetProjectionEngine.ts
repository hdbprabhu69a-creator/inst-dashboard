export function projectPatternTargets(
 pattern:string,
 breakout:number,
 height:number
){

 let multiplier=[
   1,
   1.5,
   2
 ];


 if(
  pattern.includes("HEAD") ||
  pattern.includes("SHOULDER")
 ){
   multiplier=[
    1,
    1.5,
    2
   ];
 }


 if(
  pattern.includes("FLAG")
 ){
   multiplier=[
    1,
    1.5,
    2
   ];
 }


 if(
  pattern.includes("TRIANGLE")
 ){
   multiplier=[
    1,
    1.5,
    2
   ];
 }


 return {

  T1:Number(
   (breakout + height*multiplier[0])
   .toFixed(2)
  ),

  T2:Number(
   (breakout + height*multiplier[1])
   .toFixed(2)
  ),

  T3:Number(
   (breakout + height*multiplier[2])
   .toFixed(2)
  )

 };

}

