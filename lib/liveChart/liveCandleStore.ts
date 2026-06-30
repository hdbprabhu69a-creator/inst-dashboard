export interface LiveCandle {
  symbol:string;
  open:number;
  high:number;
  low:number;
  close:number;
  volume:number;
  time:number;
}

let current:LiveCandle|null=null;

export function setLiveCandle(c:LiveCandle){
  current=c;
}

export function getLiveCandle(){
  return current;
}
