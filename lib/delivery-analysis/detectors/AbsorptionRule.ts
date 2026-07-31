import type {
  DetectorContext,
  DetectorResult,
  DetectorRule
} from "../DeliveryTypes";

export class AbsorptionRule
implements DetectorRule {

  evaluate(
    context: DetectorContext
  ): DetectorResult {

    const m = context.latestMetrics;

    if (!m) {
      return {
        detector:"ABSORPTION",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected =
      (m.dailyDeliveryPercent ?? 0) >= 55 &&
      (m.deliveryGrowth ?? 0) > 0 &&
      Math.abs(m.deliveryMomentum ?? 0) < 0.25 &&
      (m.rolling[20].zScore ?? -99) > 0;

    return {

      detector:"ABSORPTION",

      detected,

      configured:true,

      rationale:
        detected
          ? "Institutional absorption detected."
          : "Absorption criteria not satisfied.",

      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        zScore20:m.rolling[20].zScore
      }

    };

  }

}

