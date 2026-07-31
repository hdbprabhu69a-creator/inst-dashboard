export function getPivotVerdict(score:number){

  if(score>=90) return "STRONG BUY";

  if(score>=75) return "BUY";

  if(score>=50) return "HOLD";

  if(score>=25) return "SELL";

  return "STRONG SELL";

}

