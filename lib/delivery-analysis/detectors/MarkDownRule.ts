import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class MarkDownRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"MARK_DOWN",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.deliveryGrowth??0)<0 &&
      (m.deliveryMomentum??0)<0 &&
      (m.dailyDeliveryPercent??100)<=45 &&
      (m.rolling[20].zScore??99)<0;

    return{
      detector:"MARK_DOWN",
      detected,
      configured:true,
      rationale:detected
        ?"Mark-down phase detected."
        :"Mark-down criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore
      }
    };

  }

}
