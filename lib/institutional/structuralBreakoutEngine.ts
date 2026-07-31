import { StructuralTrend } from "./structuralTrendEngine";

export function detectStructuralBreakout(
  cmp:number,
  trend:StructuralTrend
){

  const support=
    trend.activeSupport;

  const resistance=
    trend.activeResistance;

  if(
    !support &&
    !resistance
  ){
    return{
      state:"UNKNOWN",
      score:0
    };
  }

  if(
    resistance &&
    cmp>resistance.price
  ){
    return{
      state:"BREAKOUT_UP",
      score:100
    };
  }

  if(
    support &&
    cmp<support.price
  ){
    return{
      state:"BREAKDOWN",
      score:100
    };
  }

  if(
    resistance &&
    Math.abs(cmp-resistance.price)/resistance.price<0.005
  ){
    return{
      state:"TESTING_RESISTANCE",
      score:80
    };
  }

  if(
    support &&
    Math.abs(cmp-support.price)/support.price<0.005
  ){
    return{
      state:"TESTING_SUPPORT",
      score:80
    };
  }

  return{
    state:"INSIDE_STRUCTURE",
    score:50
  };

}

