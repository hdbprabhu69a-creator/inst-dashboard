import type { AnalysisResult, RankingEntry, ScoreName } from "./DeliveryTypes";

/** Ranks completed analyses by a caller-selected configured score without mutating inputs. */
export class DeliveryRanking {
  rank(results: readonly AnalysisResult[], score: ScoreName = "composite"): RankingEntry[] {
    return results.map((result) => ({ result, value: result.scores[score].value })).sort((left, right) => (right.value ?? -Infinity) - (left.value ?? -Infinity) || left.result.symbol.localeCompare(right.result.symbol)).map((item, index) => ({ symbol: item.result.symbol, rank: index + 1, score: item.value, result: item.result }));
  }
}
