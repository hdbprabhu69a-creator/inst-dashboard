import { PatternType } from "./types";

export type PatternMetadata = {

  title: string;

  lineLabels: string[];

};

export const PATTERN_METADATA: Record<PatternType, PatternMetadata> = {

  NONE: {
    title: "None",
    lineLabels: [],
  },

  ASC_TRIANGLE: {
    title: "Ascending Triangle",
    lineLabels: ["Resistance","Support","Breakout"],
  },

  DESC_TRIANGLE: {
    title: "Descending Triangle",
    lineLabels: ["Resistance","Support","Breakout"],
  },

  SYM_TRIANGLE: {
    title: "Symmetrical Triangle",
    lineLabels: ["Resistance","Support","Breakout"],
  },

  CHANNEL: {
    title: "Channel",
    lineLabels: ["Upper Channel","Lower Channel"],
  },

  HEAD_SHOULDER: {
    title: "Head & Shoulders",
    lineLabels: ["Neckline"],
  },

  INVERSE_HEAD_SHOULDER: {
    title: "Inverse Head & Shoulders",
    lineLabels: ["Neckline"],
  },

  DOUBLE_TOP: {
    title: "Double Top",
    lineLabels: ["Resistance","Neckline"],
  },

  DOUBLE_BOTTOM: {
    title: "Double Bottom",
    lineLabels: ["Support","Neckline"],
  },

  TRIPLE_TOP: {
    title: "Triple Top",
    lineLabels: ["Resistance","Neckline"],
  },

  TRIPLE_BOTTOM: {
    title: "Triple Bottom",
    lineLabels: ["Support","Neckline"],
  },

  CUP_HANDLE: {
    title: "Cup & Handle",
    lineLabels: ["Cup","Handle","Breakout"],
  },

  BULL_FLAG: {
    title: "Bull Flag",
    lineLabels: ["Flag Pole","Flag","Breakout"],
  },

  BEAR_FLAG: {
    title: "Bear Flag",
    lineLabels: ["Flag Pole","Flag","Breakout"],
  },

  RECTANGLE: {
    title: "Rectangle",
    lineLabels: ["Resistance","Support"],
  },

  RISING_WEDGE: {
    title: "Rising Wedge",
    lineLabels: ["Upper Wedge","Lower Wedge"],
  },

  FALLING_WEDGE: {
    title: "Falling Wedge",
    lineLabels: ["Upper Wedge","Lower Wedge"],
  },

};

export function getPatternMetadata(type: PatternType){

  return PATTERN_METADATA[type] ?? PATTERN_METADATA.NONE;

}
