"use client";

import {
  useSelectedStock,
} from "@/src/context/SelectedStockContext";

export default function VerifyButton() {

  const {
    selectedStock,
    marketStructure,
    marketStructureLoading,
  } = useSelectedStock();

  const runVerify =
    () => {

      if (marketStructureLoading) {

        alert(
          "Market Structure Loading..."
        );

        return;

      }

      if (!marketStructure) {

  alert(
    `FAILED

Stock:
${selectedStock}

No Firebase Record Found`
  );

  return;

}

const round =
  (value: number) =>
    Number(
      value.toFixed(2)
    );

const expectedDailyPivot =
  round(
    (
      marketStructure.dailyOHLC.high +
      marketStructure.dailyOHLC.low +
      marketStructure.dailyOHLC.close
    ) / 3
  );

const actualDailyPivot =
  round(
    marketStructure.dailyPivot.pivot
  );

const expectedBC =
  round(
    (
      marketStructure.dailyOHLC.high +
      marketStructure.dailyOHLC.low
    ) / 2
  );

const expectedTC =
  round(
    (
      expectedDailyPivot -
      expectedBC
    ) +
    expectedDailyPivot
  );

const actualBC =
  round(
    marketStructure.dailyCPR.bc
  );

const actualTC =
  round(
    marketStructure.dailyCPR.tc
  );

if (
  expectedBC !==
  actualBC
) {

  alert(
    `FAILED

${selectedStock}

Daily CPR BC Mismatch

Expected:
${expectedBC}

Actual:
${actualBC}`
  );

  return;

}

if (
  expectedTC !==
  actualTC
) {

  alert(
    `FAILED

${selectedStock}

Daily CPR TC Mismatch

Expected:
${expectedTC}

Actual:
${actualTC}`
  );

  return;

}

if (
  expectedDailyPivot !==
  actualDailyPivot
) {

  alert(
    `FAILED

${selectedStock}

Daily Pivot Mismatch

Expected:
${expectedDailyPivot}

Actual:
${actualDailyPivot}`
  );

  return;

}

      //
      // DAILY
      //

      if (!marketStructure.dailyOHLC) return alert(`FAILED\n\n${selectedStock}\n\nMissing dailyOHLC`);
      if (!marketStructure.dailyPivot) return alert(`FAILED\n\n${selectedStock}\n\nMissing dailyPivot`);
      if (!marketStructure.dailyCPR) return alert(`FAILED\n\n${selectedStock}\n\nMissing dailyCPR`);
      if (marketStructure.dailyVWAP == null) return alert(`FAILED\n\n${selectedStock}\n\nMissing dailyVWAP`);

      //
      // WEEKLY
      //

      if (!marketStructure.weeklyOHLC) return alert(`FAILED\n\n${selectedStock}\n\nMissing weeklyOHLC`);
      if (!marketStructure.weeklyPivot) return alert(`FAILED\n\n${selectedStock}\n\nMissing weeklyPivot`);
      if (!marketStructure.weeklyCPR) return alert(`FAILED\n\n${selectedStock}\n\nMissing weeklyCPR`);
      if (marketStructure.weeklyVWAP == null) return alert(`FAILED\n\n${selectedStock}\n\nMissing weeklyVWAP`);

      //
      // MONTHLY
      //

      if (!marketStructure.monthlyOHLC) return alert(`FAILED\n\n${selectedStock}\n\nMissing monthlyOHLC`);
      if (!marketStructure.monthlyPivot) return alert(`FAILED\n\n${selectedStock}\n\nMissing monthlyPivot`);
      if (!marketStructure.monthlyCPR) return alert(`FAILED\n\n${selectedStock}\n\nMissing monthlyCPR`);
      if (marketStructure.monthlyVWAP == null) return alert(`FAILED\n\n${selectedStock}\n\nMissing monthlyVWAP`);

      //
      // SWINGS
      //

      if (!(marketStructure as any).oneWeekSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneWeekSwing`);
      if (!(marketStructure as any).twoWeekSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing twoWeekSwing`);
      if (!(marketStructure as any).oneMonthSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneMonthSwing`);
      if (!(marketStructure as any).threeMonthSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing threeMonthSwing`);
      if (!(marketStructure as any).sixMonthSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing sixMonthSwing`);
      if (!(marketStructure as any).oneYearSwing) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneYearSwing`);

      //
      // FIBS
      //

      if (!(marketStructure as any).oneWeekFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneWeekFib`);
      if (!(marketStructure as any).twoWeekFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing twoWeekFib`);
      if (!(marketStructure as any).oneMonthFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneMonthFib`);
      if (!(marketStructure as any).threeMonthFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing threeMonthFib`);
      if (!(marketStructure as any).sixMonthFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing sixMonthFib`);
      if (!(marketStructure as any).oneYearFib) return alert(`FAILED\n\n${selectedStock}\n\nMissing oneYearFib`);

      alert(
`FULLY VERIFIED

Stock:
${selectedStock}

âœ“ Firebase Record

âœ“ Daily Structure
âœ“ Weekly Structure
âœ“ Monthly Structure

âœ“ 1W Swing
âœ“ 2W Swing
âœ“ 1M Swing
âœ“ 3M Swing
âœ“ 6M Swing
âœ“ 1Y Swing

âœ“ 1W Fib
âœ“ 2W Fib
âœ“ 1M Fib
âœ“ 3M Fib
âœ“ 6M Fib
âœ“ 1Y Fib

INST Dashboard Structure Verified`
      );

    };

  return (

    <button
      onClick={runVerify}
      className="
        px-2
        py-0.5
        h-6
        rounded-md
        bg-green-600
        hover:bg-green-500
        text-white
        text-[11px]
        font-medium
        flex
        items-center
      "
    >
      VERIFY
    </button>

  );

}
