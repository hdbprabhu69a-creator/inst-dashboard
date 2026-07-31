export type PredictionRecord = {
  pattern: string;
  direction: "UP" | "DOWN" | "SIDE";
  confidence: number;
  regime: string;
  entryPrice: number;
  timestamp: number;
  result?: "WIN" | "LOSS" | "UNKNOWN";
};

const memory: PredictionRecord[] = [];

export function storePrediction(record: PredictionRecord) {
  memory.push(record);
}

export function resolvePrediction(
  index: number,
  outcome: "WIN" | "LOSS"
) {
  if (memory[index]) {
    memory[index].result = outcome;
  }
}

export function getPatternAccuracy(pattern: string) {

  const filtered = memory.filter(m => m.pattern === pattern && m.result);

  if (filtered.length === 0) return 50; // neutral default

  const wins = filtered.filter(m => m.result === "WIN").length;

  return (wins / filtered.length) * 100;
}

export function getSystemMemory() {
  return memory;
}

