import {
IChartApi,
Time,
} from "lightweight-charts";

import {
PatternResult,
} from "@/lib/pattern/types";

export type ScreenPoint={

label:string;

time:Time;

price:number;

x:number;

y:number;

visible:boolean;

};

export class CoordinateEngine{

private chart: IChartApi;
private series: any;

constructor(
  chart: IChartApi,
  series: any
) {
  this.chart = chart;
  this.series = series;
}

public toScreen(

pattern:PatternResult|null,

):ScreenPoint[]{

if(!pattern)
return[];

const ts=

this.chart.timeScale();

const ps =
  this.series;
const result:ScreenPoint[]=[];

for(

const point of pattern.points

){

const x=

ts.timeToCoordinate(

point.swing.time as Time

);

const y=

ps.priceToCoordinate(

point.swing.price

);

result.push({

label:

point.label,

time:

point.swing.time as Time,

price:

point.swing.price,

x:

x??0,

y:

y??0,

visible:

x!==null&&

y!==null,

});

}

return result;

}

public update(

points:ScreenPoint[]

):ScreenPoint[]{

const ts=

this.chart.timeScale();

const ps=

this.chart.priceScale("right");

return points.map(p=>{

const x=

ts.timeToCoordinate(

p.time

);

const y=

ps.priceToCoordinate(

p.price

);

return{

...p,

x:x??0,

y:y??0,

visible:

x!==null&&

y!==null,

};

});

}

}
export function patternToScreen(
  chart: IChartApi,
  series: any,
  pattern: PatternResult | null,
): ScreenPoint[] {
  return new CoordinateEngine(
    chart,
    series
  ).toScreen(pattern);
}