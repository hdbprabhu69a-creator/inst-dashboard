import type { AnalysisResult, ScoreName, ScoreResult, ScoringStrategy } from "./DeliveryTypes";

/** Executes supplied scoring policies and exposes explicit unconfigured score states. */
export class DeliveryScoring {
  score(result: Omit<AnalysisResult, "scores" | "signals" | "trend" | "confidence" | "detectorResults">, strategies: readonly ScoringStrategy[]): Readonly<Record<ScoreName, ScoreResult>> {
    const byName = new Map(strategies.map((strategy) => [strategy.name, strategy]));
    return Object.fromEntries((["composite", "institutional", "trend", "confidence"] as const).map((name) => {
      const strategy = byName.get(name);
      return [name, strategy ? strategy.score(result) : { name, value: null, configured: false, rationale: `TODO: configure the ${name} scoring strategy.` }];
    })) as Readonly<Record<ScoreName, ScoreResult>>;
  }
}
