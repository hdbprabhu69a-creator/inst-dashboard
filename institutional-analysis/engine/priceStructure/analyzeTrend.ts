import { detectSwingHighs } from "./detectSwingHighs";
import { detectSwingLows } from "./detectSwingLows";
import { mergeSwings } from "./mergeSwings";
import { classifyStructure } from "./classifyStructure";
import { structureIntegrity } from "./structureIntegrity";
import { trendPhase } from "./trendPhase";
import { trendStrength } from "./trendStrength";
import { trendConfidence } from "./trendConfidence";

export function analyzeTrend(candles:any[]){

    const highs=detectSwingHighs(candles);
    const lows=detectSwingLows(candles);

    const swings=mergeSwings(highs,lows);

    const structure=classifyStructure(swings);

    const integrity=structureIntegrity(
        structure.structure,
        candles.at(-1)!.close,
        structure.lastHigherLow,
        structure.lastLowerHigh
    );

    const phase=trendPhase(
        structure.structure,
        integrity.intact,
        structure.higherHighs,
        structure.higherLows,
        structure.lowerHighs,
        structure.lowerLows
    );

    const strength=trendStrength(
        structure.higherHighs,
        structure.higherLows,
        structure.lowerHighs,
        structure.lowerLows,
        integrity.intact
    );

    const confidence=trendConfidence(
        strength,
        integrity.intact,
        phase
    );

    return{

        score:strength.score,

        structure:structure.structure,

        phase,

        verdict:
            strength.score>=80?"BUY":
            strength.score>=60?"ACC":
            strength.score>=40?"WATCH":
            "AVOID",

        confidence:confidence.score

    };

}
