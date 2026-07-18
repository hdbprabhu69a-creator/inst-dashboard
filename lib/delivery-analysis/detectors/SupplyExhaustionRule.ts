import type {
  DetectorContext,
  DetectorResult,
  DetectorRule
} from "../DeliveryTypes";

export class SupplyExhaustionRule
implements DetectorRule {

  evaluate(
    context: DetectorContext
  ): DetectorResult {

    const m = context.latestMetrics;

    if (!m) {
      return {
        detector:"SUPPLY_EXHAUSTION",
        detected:false,
        configured:true,
        rationale:"No metrics available."
      };
    }

    const detected =
      (m.dailyDeliveryPercent ?? 0) >= 60 &&
      (m.deliveryGrowth ?? 0) > 0 &&
      (m.deliveryMomentum ?? 0) > 0 &&
      (m.volumeExpansion ?? 0) < 0;

    return {

      detector:"SUPPLY_EXHAUSTION",

      detected,

      configured:true,

      rationale:
        detected
          ? "Supply exhaustion detected."
          : "Supply exhaustion criteria not satisfied.",

      metadata:{
        deliveryPercent:m.dailyDeliveryPercent,
        growth:m.deliveryGrowth,
        momentum:m.deliveryMomentum,
        volumeExpansion:m.volumeExpansion
      }

    };

  }

}
