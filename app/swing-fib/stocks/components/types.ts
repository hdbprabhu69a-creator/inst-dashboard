export interface SwingPoint{
  high?:number;
  highDate?:any;
  low?:number;
  lowDate?:any;
}

export interface Fib{
  fib236?:number;
  fib382?:number;
  fib50?:number;
  fib618?:number;
  fib786?:number;
}

export interface Pivot{

  pivot?:number;

  s1?:number;
  s2?:number;
  s3?:number;

  r1?:number;
  r2?:number;
  r3?:number;

}

export interface Volume{
  daily?:number;
  weekly?:number;
  monthly?:number;
}

export interface Trend{
  phase?:string;
}

export interface Stock{

  symbol:string;
  sector:string;

  cmp?:number;
  liveCmp?:number;

  oneWeekSwing?:SwingPoint;
  twoWeekSwing?:SwingPoint;
  oneMonthSwing?:SwingPoint;
  threeMonthSwing?:SwingPoint;
  sixMonthSwing?:SwingPoint;
  oneYearSwing?:SwingPoint;

  oneWeekFib?:Fib;
  twoWeekFib?:Fib;
  oneMonthFib?:Fib;
  threeMonthFib?:Fib;
  sixMonthFib?:Fib;
  oneYearFib?:Fib;

  dailyPivot?:Pivot;
  weeklyPivot?:Pivot;
  monthlyPivot?:Pivot;

  volume?:Volume;

  deliveryPercent?:number;

  trend?:Trend;

  marketState?:string;

  target?:number;

  stopLoss?:number;

}


