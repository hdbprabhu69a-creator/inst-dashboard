export type CPRBias =
  | "STRONG_BULLISH"
  | "BULLISH"
  | "NEUTRAL"
  | "BEARISH"
  | "STRONG_BEARISH";

export interface CPRBiasResult{
  bias:CPRBias;
  score:number;
}

export function getCPRBias(
  relationship:string,
  position:string,
  breakoutBullish:boolean,
  breakoutBearish:boolean,
  acceptedAbove:boolean,
  acceptedBelow:boolean
):CPRBiasResult{

  let score=50;

  switch(relationship){

    case "HIGHER":
      score+=20;
      break;

    case "OVERLAP_HIGHER":
      score+=15;
      break;

    case "LOWER":
      score-=20;
      break;

    case "OVERLAP_LOWER":
      score-=15;
      break;

  }

  switch(position){

    case "ABOVE_R3":
      score+=20;
      break;

    case "R2_R3":
      score+=15;
      break;

    case "R1_R2":
      score+=10;
      break;

    case "INSIDE_CPR":
      score+=0;
      break;

    case "S1_BC":
      score-=10;
      break;

    case "S2_S1":
      score-=15;
      break;

    case "BELOW_S2":
      score-=20;
      break;

  }

  if(breakoutBullish)
    score+=10;

  if(breakoutBearish)
    score-=10;

  if(acceptedAbove)
    score+=10;

  if(acceptedBelow)
    score-=10;

  score=Math.max(0,Math.min(score,100));

  let bias:CPRBias="NEUTRAL";

  if(score>=85)
    bias="STRONG_BULLISH";
  else if(score>=65)
    bias="BULLISH";
  else if(score>=35)
    bias="NEUTRAL";
  else if(score>=15)
    bias="BEARISH";
  else
    bias="STRONG_BEARISH";

  return{
    bias,
    score
  };

}
