import { performanceEngine } from "./performanceEngine";

class LearningEngine {

  private patternWeights: Map<string, number> = new Map();

  update(pattern: string, result: "WIN" | "LOSS") {

    const current = this.patternWeights.get(pattern) || 1;

    const adjustment =
      result === "WIN"
        ? 0.05
        : -0.08;

    const updated = Math.max(0.1, current + adjustment);

    this.patternWeights.set(pattern, updated);
  }

  getWeight(pattern: string) {
    return this.patternWeights.get(pattern) || 1;
  }

  adjustConfidence(pattern: string, baseConfidence: number) {
    const weight = this.getWeight(pattern);
    return Math.min(100, baseConfidence * weight);
  }

}

export const learningEngine = new LearningEngine();

