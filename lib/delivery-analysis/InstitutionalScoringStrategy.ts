import type {
  AnalysisResult,
  ScoreResult,
  ScoringStrategy
} from "./DeliveryTypes";

export class InstitutionalScoringStrategy
implements ScoringStrategy {

  readonly name = "institutional" as const;

  score(
    result: Omit<
      AnalysisResult,
      "scores" |
      "signals" |
      "trend" |
      "confidence" |
      "detectorResults"
    >
  ): ScoreResult {

    const m = result.latestMetrics;

    if (!m) {

      return {
        name: this.name,
        value: null,
        configured: true,
        rationale: "No metrics available."
      };

    }

    let score = 0;

    if ((m.dailyDeliveryPercent ?? 0) >= 50) score += 25;

    if ((m.deliveryGrowth ?? 0) > 0) score += 20;

    if ((m.deliveryMomentum ?? 0) > 0) score += 20;

    if ((m.deliveryAcceleration ?? 0) > 0) score += 15;

    if ((m.historicalPercentile ?? 0) >= 70) score += 20;

    score = Math.max(0, Math.min(100, score));

    return {

      name: this.name,

      value: score,

      configured: true,

      rationale:
        "Institutional score calculated from delivery %, growth, momentum, acceleration and percentile."

    };

  }

}


