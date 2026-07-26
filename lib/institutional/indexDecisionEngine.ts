import {
  MarketState,
} from "@/lib/marketState/stateEngine";


type DecisionInput = {

  symbol:string;

  cmp:number;

  marketState:MarketState;

  trend:any;

  regime:any;

  pivot?:any;

  cpr?:any;

  swing?:any;

  fib?:any;

  baseTarget?:any;

};



export function buildIndexDecision(
 input:DecisionInput
){

const trend =
  input.trend;

const regime =
  input.regime;


const cmp=input.cmp;


const pivot =
 input.pivot?.dailyValue ??
 input.pivot?.pivot ??
 0;


const targets:number[]=[];


if(input.pivot?.dailyR1)
 targets.push(
  Number(input.pivot.dailyR1.toFixed(2))
 );


if(input.pivot?.dailyR2)
 targets.push(
  Number(input.pivot.dailyR2.toFixed(2))
 );


if(input.fib?.fib618)
 targets.push(
  Number(input.fib.fib618.toFixed(2))
 );


const supports:number[]=[];


if(input.pivot?.dailyS1)
 supports.push(
  Number(input.pivot.dailyS1.toFixed(2))
 );


if(input.pivot?.dailyS2)
 supports.push(
  Number(input.pivot.dailyS2.toFixed(2))
 );


if(input.swing?.low)
 supports.push(
  Number(input.swing.low.toFixed(2))
 );


const reasons:string[]=[];


if(cmp>pivot)
 reasons.push("CMP above Pivot");
else
 reasons.push("CMP below Pivot");


if(
 regime.confirmation?.macd==="POSITIVE"
)
 reasons.push("MACD Positive");


if(
 regime.confirmation?.adx>=25
)
 reasons.push("ADX Trend Confirmed");
else
 reasons.push("ADX Weak Trend");


if(
 regime.confirmation?.rsi>50
)
 reasons.push("RSI Positive");


if(
 input.marketState!=="Unknown"
)
 reasons.push(
  `Market State ${input.marketState}`
 );


return {

 symbol:input.symbol,

 cmp,

 trend:
  trend.trend ?? trend,

 marketState:
  input.marketState,

 phase:
  trend.phase,

 structure:
  trend.structure,

 confidence:
  trend.confidence,

 strength:
  trend.strength,

 bias:
  regime.institutionalBias,

 trigger:{

  above:
   input.pivot?.dailyR1 ?? 0,

  below:
   input.pivot?.dailyS1 ?? 0

 },

 targets,

 supports,

 reasons,

 baseTarget:
   input.baseTarget

};

}








