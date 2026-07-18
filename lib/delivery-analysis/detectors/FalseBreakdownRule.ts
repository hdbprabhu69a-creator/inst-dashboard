import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class FalseBreakdownRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"FALSE_BREAKDOWN",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.deliveryGrowth??0)>0 &&
      (m.deliveryMomentum??0)>0 &&
      (m.dailyDeliveryPercent??0)<=45 &&
      (m.rolling[20].zScore??-99)>0;

    return{
      detector:"FALSE_BREAKDOWN",
      detected,
      configured:true,
      rationale:detected
        ?"False breakdown detected."
        :"False breakdown criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore
      }
    };

  }

}
