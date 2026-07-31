export function detectTrendChannel(
 structure:any
){

 if(!structure)
 return null;


 const high =
 structure.swingHigh.price;


 const low =
 structure.swingLow.price;



 return {

  resistance:
   high,

  support:
   low,


  channel:

   Math.abs(high-low)
   /
   low < 0.10

   ?
   "RANGE_CHANNEL"

   :
   "EXPANDING_STRUCTURE"

 };

}

