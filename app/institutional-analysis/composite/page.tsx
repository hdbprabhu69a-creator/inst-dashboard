"use client";

import { useEffect, useState } from "react";
import CompositeGrid from "../components/engines/CompositeGrid";

export default function CompositePage() {
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading,setLoading]=useState(false);
const [stocks,setStocks]=useState<string[]>([]);

  


useEffect(()=>{
(async()=>{
const res=await fetch("/api/institutional/universe");
const json=await res.json();
setStocks((json.stocks??[]).map((x:any)=>x.symbol));
console.log("Universe Loaded:",json.stocks.length);
})();
},[]);
async function loadAnalysis(){
    const selected = search.trim().toUpperCase();
    if (!selected) return;

    setLoading(true);

    try {
      const res = await fetch(
        `/api/institutional-analysis/composite?symbol=${selected}`
      );

      const json = await res.json();

      const deliveryRes = await fetch(
        `/api/institutional-analysis/delivery?symbol=${selected}`
      );

      const deliveryJson = await deliveryRes.json();

      console.log("COMPOSITE API", json);
      console.log("DELIVERY API", deliveryJson); console.log("DELIVERY ANALYSIS", JSON.stringify(deliveryJson.analysis ?? deliveryJson.data,null,2)); console.log("DELIVERY KEYS", Object.keys(deliveryJson.analysis ?? deliveryJson.data ?? {}));

      setSymbol(selected);

      setAnalysis({
        ...(json.data ?? {}),
        delivery: Array.isArray(deliveryJson.data) ? deliveryJson.data[0] : (Array.isArray(deliveryJson.analysis) ? deliveryJson.analysis[0] : (deliveryJson.data ?? deliveryJson.analysis ?? null))
      });
    } finally {
      setLoading(false);
    }
  }

  const pivotRows =
    analysis?.pivot
      ? [
          {
            symbol,
            cmp: analysis.cmp ?? null,

            dailyValue: analysis.pivot.daily?.pivot,
            dailyR1: analysis.pivot.daily?.r1,
            dailyR2: analysis.pivot.daily?.r2,
            dailyS1: analysis.pivot.daily?.s1,
            dailyS2: analysis.pivot.daily?.s2,

            weeklyValue: analysis.pivot.weekly?.pivot,
            weeklyR1: analysis.pivot.weekly?.r1,
            weeklyR2: analysis.pivot.weekly?.r2,
            weeklyS1: analysis.pivot.weekly?.s1,
            weeklyS2: analysis.pivot.weekly?.s2,

            monthlyValue: analysis.pivot.monthly?.pivot,
            monthlyR1: analysis.pivot.monthly?.r1,
            monthlyR2: analysis.pivot.monthly?.r2,
            monthlyS1: analysis.pivot.monthly?.s1,
            monthlyS2: analysis.pivot.monthly?.s2,

            alignment: analysis.pivot.alignment,
            bias: analysis.pivot.bias,
            score: analysis.pivot.score,
            verdict: analysis.pivot.verdict,
          },
        ]
      : [
,

  ...(analysis?.delivery ? [{

    engine:"DELIVERY",

    daily:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    weekly:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    monthly:
      analysis.delivery.accumulation
        ? "ACCUMULATION"
        : analysis.delivery.distribution
        ? "DISTRIBUTION"
        : "-",

    position:
      analysis.delivery.smartMoneyEntry
        ? "SMART MONEY ENTRY"
        : analysis.delivery.smartMoneyExit
        ? "SMART MONEY EXIT"
        : "-",

    bias:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    alignment:
      analysis.delivery.absorption
        ? "ABSORPTION"
        : "-",

    score:
      analysis.delivery.composite ?? analysis.deliveryScore ?? 0,

    verdict:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    deliveryPercent:
      analysis.delivery.deliveryPercent ?? analysis.deliveryPct ?? 0,

    deliveryQty:
      analysis.delivery.deliveryQty ?? 0,

    deliveryGrowth:
      analysis.delivery.deliveryGrowth ?? 0,

    deliveryMomentum:
      analysis.delivery.deliveryMomentum ?? 0,

    deliveryAcceleration:
      analysis.delivery.deliveryAcceleration ?? 0,

    historicalPercentile:
      analysis.delivery.historicalPercentile ?? 0,

    accumulation:
      analysis.delivery.accumulation ?? false,

    distribution:
      analysis.delivery.distribution ?? false,

    absorption:
      analysis.delivery.absorption ?? false,

    smartMoneyEntry:
      analysis.delivery.smartMoneyEntry ?? false,

    smartMoneyExit:
      analysis.delivery.smartMoneyExit ?? false

}] : [])

];

  
const suggestions =
  search.length===0
    ? []
    : stocks.filter(s =>
        s.includes(search.toUpperCase()) ||
        (search.toUpperCase()==="KVB" && s==="KARURVYSYA") ||
        (search.toUpperCase()==="KARUR" && s==="KARURVYSYA") ||
        (search.toUpperCase()==="SBI" && s==="SBIN") ||
        (search.toUpperCase()==="INFOSYS" && s==="INFY")
      ).slice(0,8);

const cprRows =
  analysis?.cpr
    ? [
        {


          compression: analysis.cpr.compression?.state,
          acceptance: analysis.cpr.acceptance?.state,
          probability: analysis.cpr.probability?.verdict,

          bias: analysis.cpr.bias?.bias,
          alignment: analysis.cpr.alignment?.alignment,

          score: analysis.cpr.score,
          verdict: analysis.cpr.verdict,

          dailyBC: analysis.cpr.dailyBC,
          dailyPivot: analysis.cpr.dailyPivot,
          dailyTC: analysis.cpr.dailyTC,

          weeklyBC: analysis.cpr.weeklyBC,
          weeklyPivot: analysis.cpr.weeklyPivot,
          weeklyTC: analysis.cpr.weeklyTC,

          monthlyBC: analysis.cpr.monthlyBC,
          monthlyPivot: analysis.cpr.monthlyPivot,
          monthlyTC: analysis.cpr.monthlyTC,

          width: analysis.cpr.width?.width,
          widthPct: analysis.cpr.width?.widthPct,
          widthClass: analysis.cpr.width?.widthClass,

          relationship: analysis.cpr.relationship,
          virgin: analysis.cpr.virgin,
          opening: analysis.cpr.opening,
          position: analysis.cpr.position,

          breakout: analysis.cpr.breakout?.state,
          rejection: analysis.cpr.rejection?.state,
          gap: analysis.cpr.gap?.state
        }
      ]
    : [
,

  ...(analysis?.delivery ? [{

    engine:"DELIVERY",

    daily:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    weekly:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    monthly:
      analysis.delivery.accumulation
        ? "ACCUMULATION"
        : analysis.delivery.distribution
        ? "DISTRIBUTION"
        : "-",

    position:
      analysis.delivery.smartMoneyEntry
        ? "SMART MONEY ENTRY"
        : analysis.delivery.smartMoneyExit
        ? "SMART MONEY EXIT"
        : "-",

    bias:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    alignment:
      analysis.delivery.absorption
        ? "ABSORPTION"
        : "-",

    score:
      analysis.delivery.composite ?? analysis.deliveryScore ?? 0,

    verdict:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    deliveryPercent:
      analysis.delivery.deliveryPercent ?? analysis.deliveryPct ?? 0,

    deliveryQty:
      analysis.delivery.deliveryQty ?? 0,

    deliveryGrowth:
      analysis.delivery.deliveryGrowth ?? 0,

    deliveryMomentum:
      analysis.delivery.deliveryMomentum ?? 0,

    deliveryAcceleration:
      analysis.delivery.deliveryAcceleration ?? 0,

    historicalPercentile:
      analysis.delivery.historicalPercentile ?? 0,

    accumulation:
      analysis.delivery.accumulation ?? false,

    distribution:
      analysis.delivery.distribution ?? false,

    absorption:
      analysis.delivery.absorption ?? false,

    smartMoneyEntry:
      analysis.delivery.smartMoneyEntry ?? false,

    smartMoneyExit:
      analysis.delivery.smartMoneyExit ?? false

}] : [])

];

console.log("PIVOT ROWS",pivotRows);
console.log("CPR ROWS",cprRows);

const engineRows = [

  ...(analysis?.pivot ? [{

    engine:"PIVOT",

    daily:analysis.pivot.dailyPosition ?? "-",
    weekly:analysis.pivot.weeklyPosition ?? "-",
    monthly:analysis.pivot.monthlyPosition ?? "-",

    position:analysis.pivot.dailyPosition ?? "-",

    bias:analysis.pivot.bias ?? "-",
    alignment:analysis.pivot.alignment ?? "-",

    score:analysis.pivot.score ?? 0,
    verdict:analysis.pivot.verdict ?? "-"

  }] : []),

  ...(analysis?.cpr ? [{

    engine:"CPR",

    daily:analysis.cpr.position ?? "-",
    weekly:analysis.cpr.width?.widthClass ?? "-",
    monthly:analysis.cpr.relationship ?? "-",

    position:analysis.cpr.breakout?.state ?? "-",

    bias:analysis.cpr.bias?.bias ?? "-",
    alignment:analysis.cpr.alignment?.alignment ?? "-",

    score:analysis.cpr.score ?? 0,
    verdict:analysis.cpr.verdict ?? "-"

  }] : [])


,

  ...(analysis?.delivery ? [{

    engine:"DELIVERY",

    daily:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    weekly:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    monthly:
      analysis.delivery.accumulation
        ? "ACCUMULATION"
        : analysis.delivery.distribution
        ? "DISTRIBUTION"
        : "-",

    position:
      analysis.delivery.smartMoneyEntry
        ? "SMART MONEY ENTRY"
        : analysis.delivery.smartMoneyExit
        ? "SMART MONEY EXIT"
        : "-",

    bias:
      analysis.delivery.trend ?? analysis.delivery.trendClassification ?? "-",

    alignment:
      analysis.delivery.absorption
        ? "ABSORPTION"
        : "-",

    score:
      analysis.delivery.composite ?? analysis.deliveryScore ?? 0,

    verdict:
      analysis.delivery.signal ?? analysis.delivery.verdict ?? "-",

    deliveryPercent:
      analysis.delivery.deliveryPercent ?? analysis.deliveryPct ?? 0,

    deliveryQty:
      analysis.delivery.deliveryQty ?? 0,

    deliveryGrowth:
      analysis.delivery.deliveryGrowth ?? 0,

    deliveryMomentum:
      analysis.delivery.deliveryMomentum ?? 0,

    deliveryAcceleration:
      analysis.delivery.deliveryAcceleration ?? 0,

    historicalPercentile:
      analysis.delivery.historicalPercentile ?? 0,

    accumulation:
      analysis.delivery.accumulation ?? false,

    distribution:
      analysis.delivery.distribution ?? false,

    absorption:
      analysis.delivery.absorption ?? false,

    smartMoneyEntry:
      analysis.delivery.smartMoneyEntry ?? false,

    smartMoneyExit:
      analysis.delivery.smartMoneyExit ?? false

}] : [])

];
return (
  <div className="min-h-screen bg-[#0B0F14] text-white p-6 space-y-6">
    <div className="flex gap-3 items-center">
      <div className="relative">
        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value.toUpperCase())}
          placeholder="Search Symbol..."
          className="border rounded px-3 py-2 w-64 bg-[#11161C] border-[#2A3441]"
        />

        {suggestions.length>0 && (
          <div className="absolute top-full left-0 mt-1 w-64 rounded border border-[#2A3441] bg-[#11161C] z-50">
            {suggestions.map(s=>(
              <div
                key={s}
                className="cursor-pointer px-3 py-2 hover:bg-[#1C2430]"
                onClick={()=>setSearch(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={loadAnalysis}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Load"}
      </button>
    </div>

    <CompositeGrid rows={engineRows} />
  </div>
);
}












































