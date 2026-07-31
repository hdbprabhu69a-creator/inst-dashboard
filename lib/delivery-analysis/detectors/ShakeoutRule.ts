import type { DetectorContext, DetectorResult, DetectorRule } from "../DeliveryTypes";

export class ShakeoutRule implements DetectorRule {

  evaluate(context: DetectorContext): DetectorResult {

    const m=context.latestMetrics;

    if(!m){
      return{
        detector:"SHAKEOUT",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected=
      (m.dailyDeliveryPercent??0)>=50 &&
      (m.deliveryGrowth??0)>0 &&
      (m.deliveryMomentum??0)<0 &&
      (m.deliveryAcceleration??0)>0;

    return{
      detector:"SHAKEOUT",
      detected,
      configured:true,
      rationale:detected
        ?"Shakeout detected."
        :"Shakeout criteria not satisfied.",
      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        acceleration:m.deliveryAcceleration
      }
    };

  }

}

