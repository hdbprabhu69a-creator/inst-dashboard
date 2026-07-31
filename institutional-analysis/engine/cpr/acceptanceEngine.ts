export type CPRAcceptance =
  | "ACCEPTED_ABOVE"
  | "ACCEPTED_BELOW"
  | "INSIDE_VALUE"
  | "NOT_ACCEPTED";

export interface CPRAcceptanceResult{
  state:CPRAcceptance;
  score:number;
  bullish:boolean;
  bearish:boolean;
}

export function getCPRAcceptance(
  open:number,
  close:number,
  bc:number,
  tc:number
):CPRAcceptanceResult{

  if(open>=tc && close>=tc){

    return{
      state:"ACCEPTED_ABOVE",
      score:100,
      bullish:true,
      bearish:false
    };

  }

  if(open<=bc && close<=bc){

    return{
      state:"ACCEPTED_BELOW",
      score:100,
      bullish:false,
      bearish:true
    };

  }

  if(close>=bc && close<=tc){

    return{
      state:"INSIDE_VALUE",
      score:50,
      bullish:false,
      bearish:false
    };

  }

  return{

    state:"NOT_ACCEPTED",
    score:0,
    bullish:false,
    bearish:false

  };

}

