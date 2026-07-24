export function detectBase(
  candles:any[]
){

  const recent =
    candles.slice(-30);


  const high =
    Math.max(
      ...recent.map(
        c=>Number(c.high)
      )
    );


  const low =
    Math.min(
      ...recent.map(
        c=>Number(c.low)
      )
    );


  return {

    baseHigh:Number(
      high.toFixed(2)
    ),

    baseLow:Number(
      low.toFixed(2)
    ),

    height:Number(
      (high-low).toFixed(2)
    ),

    status:"FORMING"

  };

}
