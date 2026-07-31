export type CPRBreakout =
  | "ABOVE_CPR"
  | "BELOW_CPR"
  | "INSIDE_CPR"
  | "BREAKOUT_UP"
  | "BREAKOUT_DOWN"
  | "REJECTION_UP"
  | "REJECTION_DOWN"
  | "ACCEPTANCE_ABOVE"
  | "ACCEPTANCE_BELOW";

export interface CPRBreakoutResult{
  state:CPRBreakout;
  bullish:boolean;
  bearish:boolean;
}

export function getCPRBreakout(
  open:number,
  high:number,
  low:number,
  close:number,
  bc:number,
  tc:number
):CPRBreakoutResult{

  let state:CPRBreakout="INSIDE_CPR";

  if(open>=tc && close>=tc){
    state="ACCEPTANCE_ABOVE";
  }
  else if(open<=bc && close<=bc){
    state="ACCEPTANCE_BELOW";
  }
  else if(open<tc && close>tc){
    state="BREAKOUT_UP";
  }
  else if(open>bc && close<bc){
    state="BREAKOUT_DOWN";
  }
  else if(high>tc && close<=tc){
    state="REJECTION_UP";
  }
  else if(low<bc && close>=bc){
    state="REJECTION_DOWN";
  }
  else if(close>tc){
    state="ABOVE_CPR";
  }
  else if(close<bc){
    state="BELOW_CPR";
  }

  return{
    state,
    bullish:[
      "BREAKOUT_UP",
      "ACCEPTANCE_ABOVE",
      "ABOVE_CPR"
    ].includes(state),
    bearish:[
      "BREAKOUT_DOWN",
      "ACCEPTANCE_BELOW",
      "BELOW_CPR"
    ].includes(state)
  };

}

