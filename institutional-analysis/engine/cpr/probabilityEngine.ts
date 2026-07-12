export interface CPRProbabilityResult{
  trendDay:number;
  rangeDay:number;
  breakout:number;
  meanReversion:number;
  verdict:
    | "TREND_DAY"
    | "RANGE_DAY"
    | "BREAKOUT_DAY"
    | "MEAN_REVERSION";
}

export function getCPRProbability(
  widthPct:number,
  compressionScore:number,
  breakout:boolean
):CPRProbabilityResult{

  let trendDay=40;
  let rangeDay=40;
  let breakoutProb=40;
  let meanReversion=40;

  if(widthPct<=10){

    trendDay=90;
    breakoutProb=85;
    rangeDay=10;
    meanReversion=15;

  }
  else if(widthPct<=20){

    trendDay=75;
    breakoutProb=70;
    rangeDay=25;
    meanReversion=30;

  }
  else if(widthPct<=35){

    trendDay=55;
    breakoutProb=55;
    rangeDay=45;
    meanReversion=45;

  }
  else{

    trendDay=25;
    breakoutProb=20;
    rangeDay=75;
    meanReversion=80;

  }

  if(compressionScore>=80){

    trendDay+=5;
    breakoutProb+=5;

  }

  if(breakout){

    trendDay+=5;
    breakoutProb+=10;

  }

  trendDay=Math.min(trendDay,100);
  breakoutProb=Math.min(breakoutProb,100);
  rangeDay=Math.min(rangeDay,100);
  meanReversion=Math.min(meanReversion,100);

  let verdict:"TREND_DAY"|"RANGE_DAY"|"BREAKOUT_DAY"|"MEAN_REVERSION"="RANGE_DAY";

  const max=Math.max(
    trendDay,
    breakoutProb,
    rangeDay,
    meanReversion
  );

  if(max===trendDay)
    verdict="TREND_DAY";
  else if(max===breakoutProb)
    verdict="BREAKOUT_DAY";
  else if(max===meanReversion)
    verdict="MEAN_REVERSION";

  return{
    trendDay,
    rangeDay,
    breakout:breakoutProb,
    meanReversion,
    verdict
  };

}
