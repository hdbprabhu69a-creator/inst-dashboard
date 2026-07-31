import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class FalseBreakoutRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"FALSE_BREAKOUT",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.deliveryGrowth??0)<0 &&
      (m.deliveryMomentum??0)<0 &&
      (m.dailyDeliveryPercent??100)>=50 &&
      (m.rolling[20].zScore??99)<0;

    return{
      detector:"FALSE_BREAKOUT",
      detected,
      configured:true,
      rationale:detected
        ?"False breakout detected."
        :"False breakout criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore
      }
    };

  }

}

