export function getCPRVerdict(score:number){

  if(score>=90)
    return "STRONG BUY";

  if(score>=75)
    return "BUY";

  if(score>=60)
    return "ACCUMULATE";

  if(score>=45)
    return "HOLD";

  if(score>=25)
    return "REDUCE";

  return "SELL";

}
