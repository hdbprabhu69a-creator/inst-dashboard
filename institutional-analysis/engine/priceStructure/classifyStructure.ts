import {
  SwingPoint,
  StructureType
} from "../../models/priceStructureTypes";

export interface StructureClassification {

  structure: StructureType;

  higherHighs: number;
  higherLows: number;

  lowerHighs: number;
  lowerLows: number;

  lastHigherLow: number | null;
  lastLowerHigh: number | null;

}

export function classifyStructure(
  swings: SwingPoint[]
): StructureClassification {

  let hh = 0;
  let hl = 0;
  let lh = 0;
  let ll = 0;

  let previousHigh: SwingPoint | null = null;
  let previousLow: SwingPoint | null = null;

  let lastHigherLow: number | null = null;
  let lastLowerHigh: number | null = null;

  for (const swing of swings) {

    if (swing.type === "HIGH") {

      if (previousHigh) {

        if (swing.price > previousHigh.price) {

          hh++;

        } else {

          lh++;
          lastLowerHigh = swing.price;

        }

      }

      previousHigh = swing;

    }

    if (swing.type === "LOW") {

      if (previousLow) {

        if (swing.price > previousLow.price) {

          hl++;
          lastHigherLow = swing.price;

        } else {

          ll++;

        }

      }

      previousLow = swing;

    }

  }

  let structure: StructureType = "TRANSITION";

  if (hh > lh && hl > ll)
    structure = "HH_HL";
  else if (lh > hh && ll > hl)
    structure = "LH_LL";
  else if (
    Math.abs(hh - lh) <= 1 &&
    Math.abs(hl - ll) <= 1
  )
    structure = "RANGE";

  return {

    structure,

    higherHighs: hh,
    higherLows: hl,

    lowerHighs: lh,
    lowerLows: ll,

    lastHigherLow,
    lastLowerHigh

  };

}
