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
console.log("lastPoint.time =", lastPoint.time);
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
    // ==========================================

    drawProjection(

      "#22c55e"

    );

    // ==========================================
    // Pattern Labels (temporary)
    // ==========================================

    console.table(labels);

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

  return null;

}