"use client";

import SDKPatternRenderer from "./SDKPatternRenderer";

import {
  IChartApi,
} from "lightweight-charts";

import {
  PatternDrawing,
} from "./render/PatternDrawing";

type Props = {

  chart: IChartApi;

  drawing: PatternDrawing | null;

};

export default function SDKChartOverlay({

  chart,

  drawing,

}: Props) {

  if (!drawing)
    return null;

  return (

    <>

      <SDKPatternRenderer
        chart={chart}
        drawing={drawing}
      />

    </>

  );

}

