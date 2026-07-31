import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class DemandExhaustionRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"DEMAND_EXHAUSTION",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.dailyDeliveryPercent??100)<=40 &&
      (m.deliveryGrowth??0)<0 &&
      (m.deliveryMomentum??0)<0 &&
      (m.volumeExpansion??0)<0;

    return{
      detector:"DEMAND_EXHAUSTION",
      detected,
      configured:true,
      rationale:detected
        ?"Demand exhaustion detected."
        :"Demand exhaustion criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        volumeExpansion:m.volumeExpansion
      }
    };

  }

}

