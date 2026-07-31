"use client";

import {
  useEffect,
} from "react";

import {
  IChartApi,
  LineSeries,
} from "lightweight-charts";

import {
  PatternResult,
} from "@/lib/pattern/types";

type Props = {

  chart: IChartApi;

  pattern: PatternResult | null;

};


function getLineLabels(pattern:any){

switch(pattern.pattern){

case "ASCENDING_TRIANGLE":
return ["Resistance","Support"];

case "DESCENDING_TRIANGLE":
return ["Resistance","Support"];

case "SYMMETRICAL_TRIANGLE":
return ["Resistance","Support"];

case "RISING_CHANNEL":
return ["Upper Channel","Lower Channel"];

case "FALLING_CHANNEL":
return ["Upper Channel","Lower Channel"];

case "RISING_WEDGE":
return ["Upper Wedge","Lower Wedge"];

case "FALLING_WEDGE":
return ["Upper Wedge","Lower Wedge"];

case "BULL_FLAG":
return ["Flag Pole","Flag"];

case "BEAR_FLAG":
return ["Flag Pole","Flag"];

case "HEAD_SHOULDER":
return ["Neckline","Structure"];

case "INVERSE_HEAD_SHOULDER":
return ["Neckline","Structure"];

case "DOUBLE_TOP":
return ["Resistance","Neckline"];

case "DOUBLE_BOTTOM":
return ["Support","Neckline"];

case "CUP_HANDLE":
return ["Cup","Handle"];

default:
return ["Line 1","Line 2"];

}

}


type Label = {

  text: string;

  time: string;

  price: number;

};

export default function PatternOverlay({

  chart,

  pattern,

}: Props) {

  useEffect(() => {

    if (!pattern)
      return;

    const created: any[] = [];

    // ==========================================
    // Prepare Labels
    // ==========================================

    const labels: Label[] =

      pattern.points.map(

        p => ({

          text:
            p.label,

          time:
            p.swing.time,

          price:
            p.swing.price,

        })

      );

    // ==========================================
    // Draw Horizontal Level
    // ==========================================

    const drawHorizontal = (

      value: number,

      color: string

    ) => {

      const line =
        chart.addSeries(
          LineSeries,
          {

            color,

            lineWidth: 1,

            lineStyle: 2,

            crosshairMarkerVisible: false,

            lastValueVisible: false,

            priceLineVisible: false,

          }

        );

      const first =
        pattern.swings[0];

      const last =
        pattern.swings[
          pattern.swings.length - 1
        ];

      line.setData([

        {

          time: first.time,

          value,

        },

        {

          time: last.time,

          value,

        },

      ]);

      created.push(line);

    };

    // ==========================================
    // Draw Projection
    // ==========================================

    const drawProjection = (

      color: string

    ) => {

      if (

        pattern.points.length === 0

      )

        return;

      const lastPoint =

        pattern.points[
          pattern.points.length - 1
        ].swing;
const projection =
        chart.addSeries(
          LineSeries,
          {

            color,

            lineWidth: 3,

            crosshairMarkerVisible: false,

            lastValueVisible: false,

            priceLineVisible: false,

          }

        );

const projectionData = [
  {
    time: lastPoint.time,
    value: pattern.breakout,
  },
  {
    time:
  new Date(
    new Date(lastPoint.time).getTime() + 86400000
  )
    .toISOString()
    .slice(0, 10) as any,
    value: pattern.target,
  },
];

projection.setData(projectionData);
      created.push(
        projection
      );

    };

    // ==========================================
    // Draw Trend Lines
    // ==========================================

    for (

      const trend of pattern.trendLines

    ) {

      const line =
        chart.addSeries(
          LineSeries,
          {

            color:
              "#FFD54F",

            lineWidth: 2,

            crosshairMarkerVisible: false,

            lastValueVisible: false,

            priceLineVisible: false,

          }

        );

      line.setData([

        {

          time:
            trend.start.time,

          value:
            trend.start.price,

        },

        {

          time:
            trend.end.time,

          value:
            trend.end.price,

        },

      ]);

      created.push(
        line
      );

    }

    // ==========================================
    // Draw Pattern Shape
    // ==========================================

    if (

      pattern.points.length >= 2

    ) {

      const shape =
        chart.addSeries(
          LineSeries,
          {

            color:
              "#00E5FF",

            lineWidth: 3,

            crosshairMarkerVisible: true,

            lastValueVisible: false,

            priceLineVisible: false,

          }

        );

      const shapeData = [...pattern.points]
  .sort(
    (a, b) =>
      new Date(a.swing.time).getTime() -
      new Date(b.swing.time).getTime()
  )
  .map(p => ({
    time: p.swing.time,
    value: p.swing.price,
  }));

shape.setData(shapeData);
      created.push(
        shape
      );

    }

    // ==========================================
    // Levels
    // ==========================================

    drawHorizontal(

      pattern.breakout,

      "#22c55e"

    );

    drawHorizontal(

      pattern.target,

      "#3b82f6"

    );

    drawHorizontal(

      pattern.stoploss,

      "#ef4444"

    );

    // ==========================================
// Breakout Projection
// BUILD 013 : Disabled
// ==========================================

// Projection intentionally disabled for BUILD 013.
// BUILD 014 will re-enable after timestamp normalization.

    // ==========================================
    // Pattern Labels (temporary)
    // ==========================================

    const lineNames = getLineLabels(pattern);

const uiLabels:any[] = [];

// Pattern name
if(pattern.points.length){

const first = pattern.points[0].swing;
const last  = pattern.points[pattern.points.length-1].swing;

uiLabels.push({

text: pattern.pattern.replace(/_/g," "),

x:50,

y:18,

color:"#e5e7eb",

});

}

// Trend line labels
pattern.trendLines.forEach((line:any,index:number)=>{

uiLabels.push({

text: lineNames[index] ?? ("Line "+(index+1)),

x:50,

y:42 + index*16,

color:"#FFD54F",

});

});

    return () => {

      created.forEach(

        series =>

          chart.removeSeries(
            series
          )

      );

    };

  }, [

    chart,

    pattern,

  ]);

  return (

<div
className="absolute inset-0 pointer-events-none z-40"
>

<div
className="absolute left-3 top-3 rounded bg-black/50 px-2 py-1 text-[10px] text-zinc-200"
>

{pattern?.pattern.replace(/_/g," ")}

</div>

{pattern?.trendLines.map((_,i)=>(

<div
key={i}
className="absolute rounded bg-black/40 px-1 py-[1px] text-[9px] text-yellow-300"
style={{
left:12,
top:34+i*16,
}}
>

{getLineLabels(pattern)[i] ?? `Line ${i+1}`}

</div>

))}

<div
className="absolute rounded bg-black/40 px-1 py-[1px] text-[9px] text-green-300"
style={{
left:12,
top:72,
}}
>

Breakout

</div>

</div>

);

}









