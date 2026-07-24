function findSwings(candles:any[]){

 const highs:any[]=[];
 const lows:any[]=[];

 for(let i=2;i<candles.length-2;i++){

  const c=candles[i];

  const swingHigh=
   c.high>candles[i-1].high &&
   c.high>candles[i-2].high &&
   c.high>candles[i+1].high &&
   c.high>candles[i+2].high;

  const swingLow=
   c.low<candles[i-1].low &&
   c.low<candles[i-2].low &&
   c.low<candles[i+1].low &&
   c.low<candles[i+2].low;

  if(swingHigh){

   highs.push({
    index:i,
    price:Number(c.high),
    type:"HIGH"
   });

  }

  if(swingLow){

   lows.push({
    index:i,
    price:Number(c.low),
    type:"LOW"
   });

  }

 }

 return{
  highs,
  lows
 };

}

function buildRange(candles: any[]) {

  const high = Math.max(
    ...candles.map((c: any) => Number(c.high))
  );

  const low = Math.min(
    ...candles.map((c: any) => Number(c.low))
  );

  return {
    high,
    low,
    height: Number((high - low).toFixed(2))
  };
}

export function detectMultiLevelStructure(
  candles: any[]
) {

  if (!candles || candles.length < 50)
    return null;

  const major = candles.slice(-200);

  const intermediate = candles.slice(-100);

  const trading = candles.slice(-75);

  const majorSwings = findSwings(major);

  const intermediateSwings = findSwings(intermediate);

  const tradingSwings = findSwings(trading);

  const latestHigh =
    tradingSwings.highs.at(-1) ?? null;

  const latestLow =
    tradingSwings.lows.at(-1) ?? null;

  return{

 majorStructure: {

      highs: majorSwings.highs,

      lows: majorSwings.lows,

      range: buildRange(major)

    },

    intermediateStructure: {

      highs: intermediateSwings.highs,

      lows: intermediateSwings.lows,

      range: buildRange(intermediate)

    },

    tradingStructure: {

      highs: tradingSwings.highs,

      lows: tradingSwings.lows,

      latestHigh,

      latestLow,

      range: {

        high:
          latestHigh?.price ?? 0,

        low:
          latestLow?.price ?? 0,

        height:
          latestHigh && latestLow
            ? Number(
                (
                  latestHigh.price -
                  latestLow.price
                ).toFixed(2)
              )
            : 0

      }

    },

    latestSwings: tradingSwings

  };

}



