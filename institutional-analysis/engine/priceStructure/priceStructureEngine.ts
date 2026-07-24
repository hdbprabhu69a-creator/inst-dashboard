import { detectSwingHighs } from "./detectSwingHighs";
import { detectSwingLows } from "./detectSwingLows";
import { mergeSwings } from "./mergeSwings";
import { classifyStructure } from "./classifyStructure";
import { structureIntegrity } from "./structureIntegrity";
import { trendPhase } from "./trendPhase";
import { trendStrength } from "./trendStrength";
import { trendConfidence } from "./trendConfidence";

export function analyzePriceStructure(history:any[]){

    const swingHighs=detectSwingHighs(history);
    const swingLows=detectSwingLows(history);

    const swings=mergeSwings(swingHighs,swingLows);

    const structureResult=classifyStructure(swings);

    const last=history[history.length-1];

    const integrity=structureIntegrity(
        structureResult.structure,
        last?.close ?? 0,
        structureResult.lastHigherLow ?? null,
        structureResult.lastLowerHigh ?? null
    );

    const phase=trendPhase(
        structureResult.structure,
        integrity.intact,
        structureResult.higherHighs ?? 0,
        structureResult.higherLows ?? 0,
        structureResult.lowerHighs ?? 0,
        structureResult.lowerLows ?? 0
    );

    const strength=trendStrength(
        structureResult.higherHighs ?? 0,
        structureResult.higherLows ?? 0,
        structureResult.lowerHighs ?? 0,
        structureResult.lowerLows ?? 0,
        integrity.intact
    );

    const confidence=trendConfidence(
        strength,
        integrity.intact,
        phase
    );

    return{
        ...structureResult,
        integrity,
        phase,
        strength,
        confidence,
        swingHighs,
        swingLows
    };

}
