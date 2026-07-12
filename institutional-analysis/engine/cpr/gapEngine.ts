export type CPRGapType =
  | "GAP_UP_ABOVE_R1"
  | "GAP_UP_ABOVE_CPR"
  | "GAP_DOWN_BELOW_S1"
  | "GAP_DOWN_BELOW_CPR"
  | "OPEN_INSIDE_CPR"
  | "NO_GAP";

export interface CPRGapResult{
  state:CPRGapType;
  gap:number;
  gapPct:number;
  bullish:boolean;
  bearish:boolean;
}

export function getCPRGap(
  previousClose:number,
  open:number,
  bc:number,
  tc:number,
  r1:number,
  s1:number
):CPRGapResult{

  const gap=+(open-previousClose).toFixed(2);

  const gapPct=+(
    (gap/Math.max(previousClose,0.01))*100
  ).toFixed(2);

  if(open>=r1){

    return{
      state:"GAP_UP_ABOVE_R1",
      gap,
      gapPct,
      bullish:true,
      bearish:false
    };

  }

  if(open>tc){

    return{
      state:"GAP_UP_ABOVE_CPR",
      gap,
      gapPct,
      bullish:true,
      bearish:false
    };

  }

  if(open<=s1){

    return{
      state:"GAP_DOWN_BELOW_S1",
      gap,
      gapPct,
      bullish:false,
      bearish:true
    };

  }

  if(open<bc){

    return{
      state:"GAP_DOWN_BELOW_CPR",
      gap,
      gapPct,
      bullish:false,
      bearish:true
    };

  }

  if(open>=bc && open<=tc){

    return{
      state:"OPEN_INSIDE_CPR",
      gap,
      gapPct,
      bullish:false,
      bearish:false
    };

  }

  return{

    state:"NO_GAP",
    gap,
    gapPct,
    bullish:false,
    bearish:false

  };

}
