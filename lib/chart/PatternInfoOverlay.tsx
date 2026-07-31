"use client";

import { PatternResult } from "@/lib/pattern/types";
import { getPatternMetadata } from "@/lib/pattern/patternMetadata";

type Props = {
  pattern: PatternResult;
};

export default function PatternInfoOverlay({
  pattern,
}: Props) {

  const meta = getPatternMetadata(pattern.pattern);

  return (
    <div
      className="absolute top-3 left-3 z-50 pointer-events-none rounded bg-black/40 backdrop-blur-sm px-3 py-2 text-[10px] leading-5"
    >
      <div className="font-semibold text-white">
        {meta.title}
      </div>

      {meta.lineLabels.map((label, i) => (
        <div
          key={i}
          className={i === meta.lineLabels.length - 1 ? "text-green-300" : "text-yellow-300"}
        >
          {label}
        </div>
      ))}

      <div className="mt-1 text-zinc-400">
        Confidence : {Math.round(pattern.confidence)}%
      </div>
    </div>
  );

}

