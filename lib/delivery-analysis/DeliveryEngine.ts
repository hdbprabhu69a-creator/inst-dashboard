import { DeliveryMetricsCalculator } from "./DeliveryMetrics";
import { DeliveryNormalizer } from "./DeliveryNormalizer";
import { DeliveryRanking } from "./DeliveryRanking";
import { DeliveryScoring } from "./DeliveryScoring";
import { InstitutionalScoringStrategy } from "./InstitutionalScoringStrategy";
import { CompositeScoringStrategy } from "./CompositeScoringStrategy";
import { TrendScoringStrategy } from "./TrendScoringStrategy";
import { ConfidenceScoringStrategy } from "./ConfidenceScoringStrategy";
import { DeliverySignals } from "./DeliverySignals";
import { DeliveryTrend } from "./DeliveryTrend";
import { createDefaultDetectors } from "./detectors";
import { ROLLING_WINDOWS, type AnalysisResult, type DeliveryAnalysisBatchResult, type DeliveryEngineOptions, type DeliveryRecord, type RankingEntry, type ScoreName } from "./DeliveryTypes";

/** Orchestrates pure, synchronous delivery analysis for one or many symbols. */
export class DeliveryEngine {
  private readonly normalizer = new DeliveryNormalizer(); private readonly trend = new DeliveryTrend(); private readonly signals = new DeliverySignals(); private readonly scoring = new DeliveryScoring(); private readonly ranking = new DeliveryRanking();
  constructor(private readonly options: DeliveryEngineOptions = {}) {}
  analyze(records: readonly DeliveryRecord[]): AnalysisResult {
    const normalized = this.normalizer.normalize(records); const metrics = new DeliveryMetricsCalculator(this.options.metricStrategies).calculate(normalized, ROLLING_WINDOWS); const latestMetrics = metrics.length ? metrics[metrics.length - 1] : null; const symbol = normalized[0]?.symbol ?? "";
    if (normalized.some((record) => record.symbol !== symbol)) throw new Error("DeliveryEngine.analyze accepts one symbol at a time.");
    const core = { symbol, recordsAnalyzed: normalized.length, metrics, latestMetrics };
    const scores = this.scoring.score(core, this.options.scoringStrategies ?? [new CompositeScoringStrategy(),new InstitutionalScoringStrategy(),new TrendScoringStrategy(),new ConfidenceScoringStrategy()]); const detectorContext = { symbol, records: normalized, metrics, latestMetrics }; const detectorResults = (this.options.detectorRules ?? createDefaultDetectors()).map((rule) => rule.evaluate(detectorContext));
    const trend = this.trend.classify(latestMetrics, this.options.trendStrategy); const signals = this.signals.evaluate(latestMetrics, detectorResults, this.options.signalStrategy);
    return { ...core, scores, signals, trend, confidence: scores.confidence, detectorResults };
  }
  analyzeMany(bySymbol: ReadonlyMap<string, readonly DeliveryRecord[]>, score: ScoreName = "composite"): DeliveryAnalysisBatchResult { const analyses = [...bySymbol.values()].map((records) => this.analyze(records)); return { analyses, ranking: this.ranking.rank(analyses, score) }; }
  rank(results: readonly AnalysisResult[], score: ScoreName = "composite"): RankingEntry[] { return this.ranking.rank(results, score); }
}




