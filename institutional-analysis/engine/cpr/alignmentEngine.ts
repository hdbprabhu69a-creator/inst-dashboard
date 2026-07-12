export type CPRAlignment =
  | "TRIPLE_BULL"
  | "DOUBLE_BULL"
  | "MIXED"
  | "DOUBLE_BEAR"
  | "TRIPLE_BEAR";

export interface CPRAlignmentResult{
  alignment:CPRAlignment;
  score:number;
}

export function getCPRAlignment(
  daily:string,
  weekly:string,
  monthly:string
):CPRAlignmentResult{

  const bullish=[
    "STRONG_BULLISH",
    "BULLISH"
  ];

  const bearish=[
    "STRONG_BEARISH",
    "BEARISH"
  ];

  let bulls=0;
  let bears=0;

  if(bullish.includes(daily)) bulls++;
  if(bullish.includes(weekly)) bulls++;
  if(bullish.includes(monthly)) bulls++;

  if(bearish.includes(daily)) bears++;
  if(bearish.includes(weekly)) bears++;
  if(bearish.includes(monthly)) bears++;

  if(bulls===3){

    return{
      alignment:"TRIPLE_BULL",
      score:100
    };

  }

  if(bulls===2){

    return{
      alignment:"DOUBLE_BULL",
      score:80
    };

  }

  if(bears===3){

    return{
      alignment:"TRIPLE_BEAR",
      score:0
    };

  }

  if(bears===2){

    return{
      alignment:"DOUBLE_BEAR",
      score:20
    };

  }

  return{

    alignment:"MIXED",
    score:50

  };

}
