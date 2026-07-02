"use client";

import SDKPatternRenderer from "./SDKPatternRenderer";

import {
  IChartApi,
} from "lightweight-charts";

import {
  RenderPlan,
} from "./render/RenderPlan";

type Props = {

  chart: IChartApi;

  plan: RenderPlan | null;

};

export default function SDKChartOverlay({

  chart,

  plan,

}: Props) {

  if (!plan)
    return null;

  return (

    <>

      <SDKPatternRenderer
        chart={chart}
        plan={plan}
      />

    </>

  );

}
