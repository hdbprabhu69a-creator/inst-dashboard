export interface CPRScoreInput{
  widthScore:number;
  compressionScore:number;
  probabilityScore:number;
  biasScore:number;
  alignmentScore:number;
  acceptanceScore:number;
  rejectionScore:number;
}

export function getCPRScore({
  widthScore,
  compressionScore,
  probabilityScore,
  biasScore,
  alignmentScore,
  acceptanceScore,
  rejectionScore
}:CPRScoreInput){

  let score=0;

  score+=widthScore*0.15;
  score+=compressionScore*0.15;
  score+=probabilityScore*0.20;
  score+=biasScore*0.20;
  score+=alignmentScore*0.15;
  score+=acceptanceScore*0.10;
  score+=rejectionScore*0.05;

  score=Math.round(score);

  if(score>100) score=100;
  if(score<0) score=0;

  return score;

}

