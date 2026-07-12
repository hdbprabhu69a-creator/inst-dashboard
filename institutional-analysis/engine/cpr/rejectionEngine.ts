export type CPRRejection =
  | "REJECTED_FROM_ABOVE"
  | "REJECTED_FROM_BELOW"
  | "FAILED_BREAKOUT_UP"
  | "FAILED_BREAKOUT_DOWN"
  | "NO_REJECTION";

export interface CPRRejectionResult{
  state:CPRRejection;
  score:number;
  bullish:boolean;
  bearish:boolean;
}

export function getCPRRejection(
  open:number,
  high:number,
  low:number,
  close:number,
  bc:number,
  tc:number
):CPRRejectionResult{

  if(high>tc && close<=tc){

    return{
      state:"REJECTED_FROM_ABOVE",
      score:80,
      bullish:false,
      bearish:true
    };

  }

  if(low<bc && close>=bc){

    return{
      state:"REJECTED_FROM_BELOW",
      score:80,
      bullish:true,
      bearish:false
    };

  }

  if(open<tc && high>tc && close<tc){

    return{
      state:"FAILED_BREAKOUT_UP",
      score:90,
      bullish:false,
      bearish:true
    };

  }

  if(open>bc && low<bc && close>bc){

    return{
      state:"FAILED_BREAKOUT_DOWN",
      score:90,
      bullish:true,
      bearish:false
    };

  }

  return{

    state:"NO_REJECTION",
    score:0,
    bullish:false,
    bearish:false

  };

}
