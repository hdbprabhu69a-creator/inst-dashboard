"use client";

import { useState } from "react";

import MacroStrip from "@/components/institutional/MacroStrip";
import Link from "next/link";
import BusinesslineFeed from "@/components/institutional/BusinesslineFeed";
import MajorEventTracker from "@/components/institutional/MajorEventTracker";
import CorporateAnnouncements from "@/components/institutional/CorporateAnnouncements";

import {
  SelectedStockProvider,
  useSelectedStock
} from "@/src/context/SelectedStockContext";




function InstitutionalDeskContent() {

  const [activePage, setActivePage] =
    useState("Macro Events");

  const { selectedStock } =
    useSelectedStock();return (

    <main className="min-h-screen bg-black text-white">

      <section className="p-1">

        <div className="space-y-2">

          <MacroStrip />

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2">

            <Link
  href="/admin/macro/india"
  className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
>
  Macro
</Link>


            <button
              onClick={() => setActivePage("Corporate")}
              className={`px-3 py-1 rounded-lg text-sm ${
                activePage==="Corporate"
                ?"bg-amber-600 text-white"
                :"bg-amber-600 text-white"
              }`}
            >
              Corporate
            </button>


            <button
              onClick={() => setActivePage("BusinessLine")}
              className={`px-3 py-1 rounded-lg text-sm ${
                activePage==="BusinessLine"
                ?"bg-amber-600 text-white"
                :"bg-amber-600 text-white"
              }`}
            >
              BusinessLine
            </button>


            <button className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white">
              Sector Dashboard
            </button>


            <Link
              href="/watchlist"
              className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white"
            >
              WATCHLIST
            </Link>

            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <Link
                href="/live-dashboard"
                className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white"
              >
                SEARCH STOCK
              </Link>

              <Link
                href="/institutional-overview"
                className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
              >
                OVERVIEW
              </Link>

              <Link
                href="/pattern-analysis"
                className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
              >
                PATTERN ANALYSIS
              </Link>

              <Link
                href="/admin/news"
                className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
              >
                NEWS
              </Link>

              <Link
  href="/institutional-analysis/index-regime"
  className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
>
  INDEX REGIME
</Link>


<Link
  href="/institutional-analysis/decision"
  className="px-3 py-1 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500 transition"
>
  DECISION
</Link>

            </div>

          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">

            {activePage==="BusinessLine" && (
              <BusinesslineFeed />
            )}

            {activePage==="Macro Events" && (
              <MajorEventTracker />
            )}

            {activePage==="Corporate" && (
              <CorporateAnnouncements />
            )}

          </div>

        </div>

      </section>

    </main>

  );
}


export default function InstitutionalDesk(){

  return (

    <SelectedStockProvider>

      <InstitutionalDeskContent />

    </SelectedStockProvider>

  );

}



























