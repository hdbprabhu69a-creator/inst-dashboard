import { scoreSwingStrength } from "./swingStrengthEngine";

export function classifyStructure(
 highs:any[],
 lows:any[],
 atr:number=0
){

 if(highs.length<2 || lows.length<2){

  return{
   trend:"UNKNOWN",
   state:"UNKNOWN",
   bias:"NEUTRAL",
   confidence:0
  };

 }

 const prevHigh=highs.at(-2)!.price;
 const lastHigh=highs.at(-1)!.price;

 const prevLow=lows.at(-2)!.price;
 const lastLow=lows.at(-1)!.price;

 const highStrength=scoreSwingStrength(
  highs.at(-2)!,
  highs.at(-1)!,
  atr
 );

 const lowStrength=scoreSwingStrength(
  lows.at(-2)!,
  lows.at(-1)!,
  atr
 );

 const higherHigh=
  lastHigh>prevHigh &&
  highStrength.significant;

 const lowerHigh=
  lastHigh<prevHigh &&
  highStrength.significant;

 const higherLow=
  lastLow>prevLow &&
  lowStrength.significant;

 const lowerLow=
  lastLow<prevLow &&
  lowStrength.significant;

 let trend="RANGE";
 let state="BALANCED";
 let bias="NEUTRAL";
 let confidence=75;

 if(higherHigh && higherLow){

  trend="UPTREND";
  state="IMPULSE";
  bias="BULLISH";
  confidence=90;

 }

 else if(lowerHigh && lowerLow){

  trend="DOWNTREND";
  state="IMPULSE";
  bias="BEARISH";
  confidence=90;

 }

 else if(higherHigh && lowerLow){

  trend="RANGE";
  state="EXPANSION";
  bias="NEUTRAL";
  confidence=80;

 }

 else if(lowerHigh && higherLow){

  trend="RANGE";
  state="CONTRACTION";
  bias="NEUTRAL";
  confidence=80;

 }

 else{

  if(lastHigh>prevHigh){

   state="BREAKOUT_ATTEMPT";
   bias="BULLISH";

  }

  if(lastLow<prevLow){

   state="BREAKDOWN_ATTEMPT";
   bias="BEARISH";

  }

 }

 return{

  trend,
  state,
  bias,
  confidence

 };

}

