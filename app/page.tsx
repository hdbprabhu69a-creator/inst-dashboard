"use client";
import PivotCard
from "@/components/PivotCard";
import MarketHistoryTable
from "@/components/MarketHistoryTable";
import SwingFibCard
from "@/components/SwingFibCard";
import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { kite } from "@/lib/kite";
import MarketSnapshot from "@/components/MarketSnapshot";
import UniverseViewer from "@/components/UniverseViewer";
import BrokerConnectionManager
from "@/components/BrokerConnectionManager";
import SearchBox
from "@/components/SearchBox";
export default function Home() {
  useEffect(() => {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const status =
    params.get("status");

  const requestToken =
    params.get("request_token");

  if (
    status === "success" &&
    requestToken
  ) {

    window.location.href =
      `/api/token?request_token=${requestToken}`;

  }

}, []);
console.log(
  "SERVER ENV =",
  process.env.NEXT_PUBLIC_KITE_API_KEY
);
  console.log(app);
  console.log(kite);
  const stocks = [
    {
      symbol: "RELIANCE",
      cmp: "2908.45",
      daily: "2878.50",
      weekly: "2856.30",
      monthly: "2748.10",
      delivery: "68.35%",
      bias: "Accumulation",
      score: 87,
    },
    {
      symbol: "TCS",
      cmp: "3865.70",
      daily: "3835.20",
      weekly: "3799.60",
      monthly: "3586.40",
      delivery: "64.21%",
      bias: "Accumulation",
      score: 79,
    },
    {
      symbol: "INFY",
      cmp: "1523.80",
      daily: "1505.20",
      weekly: "1487.30",
      monthly: "1395.60",
      delivery: "61.28%",
      bias: "Breakout Fuel",
      score: 72,
    },
    {
      symbol: "SBIN",
      cmp: "812.60",
      daily: "803.10",
      weekly: "788.40",
      monthly: "721.30",
      delivery: "54.18%",
      bias: "Breakout Fuel",
      score: 62,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex">

      
      <section className="flex-1 p-6 overflow-auto">

        <div className="space-y-5">

  <div className="flex justify-between items-center">

    <SearchBox />

    <BrokerConnectionManager />

  </div>

  
        </div>
        <div className="grid grid-cols-4 gap-5 mt-8">

          <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
<div className="grid grid-cols-3 gap-5">

  <div className="col-span-2">
    <PivotCard />
  </div>

  <div>
    <SwingFibCard />
  </div>

</div>
            

          </div>

          <MarketSnapshot />
          <UniverseViewer />

          <MarketHistoryTable />
          </div>  
              </section>

    </main>
  );
}