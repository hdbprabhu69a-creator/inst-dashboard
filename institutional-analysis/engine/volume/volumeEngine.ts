import { volumeAnalysis } from "./volumeAnalysis";
import { VolumeAnalysisResult } from "./volumeTypes";

export function volumeEngine(history: any[]): VolumeAnalysisResult {

  if (!history || history.length === 0) {
    throw new Error("No market history available.");
  }

  return volumeAnalysis(history);
}

