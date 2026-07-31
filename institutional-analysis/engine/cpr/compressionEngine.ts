export type CPRCompression =
  | "EXTREME_COMPRESSION"
  | "HIGH_COMPRESSION"
  | "NORMAL"
  | "LOW_COMPRESSION"
  | "NO_COMPRESSION";

export interface CPRCompressionResult{
  score:number;
  state:CPRCompression;
  trendProbability:number;
  rangeProbability:number;
}

export function getCPRCompression(
  widthPct:number
):CPRCompressionResult{

  let score=0;
  let state:CPRCompression="NORMAL";

  if(widthPct<=8){
    score=100;
    state="EXTREME_COMPRESSION";
  }
  else if(widthPct<=15){
    score=85;
    state="HIGH_COMPRESSION";
  }
  else if(widthPct<=30){
    score=60;
    state="NORMAL";
  }
  else if(widthPct<=45){
    score=30;
    state="LOW_COMPRESSION";
  }
  else{
    score=10;
    state="NO_COMPRESSION";
  }

  const trendProbability=Math.min(score,100);
  const rangeProbability=100-trendProbability;

  return{
    score,
    state,
    trendProbability,
    rangeProbability
  };

}

