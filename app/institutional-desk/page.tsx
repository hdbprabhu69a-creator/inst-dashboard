"use client";

import { useState } from "react";

import MacroStrip from "@/components/institutional/MacroStrip";
import BusinesslineFeed from "@/components/institutional/BusinesslineFeed";
import MajorEventTracker from "@/components/institutional/MajorEventTracker";
import CorporateAnnouncements from "@/components/institutional/CorporateAnnouncements";

export default function InstitutionalDesk() {
  const [activePage, setActivePage] =
    useState("Macro Events");

  return (
    <div className="min-h-screen bg-black p-4">
      <MacroStrip />

      <div className="flex gap-3 mt-3">
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          {activePage === "BusinessLine" && (
            <BusinesslineFeed />
          )}

          {activePage === "Macro Events" && (
            <MajorEventTracker />
          )}

          {activePage === "Corporate" && (
            <CorporateAnnouncements />
          )}
        </div>

        <div className="w-[240px] bg-zinc-950 border border-zinc-800 rounded-xl p-3 h-fit sticky top-4">
          <div className="space-y-2">
            <button
              onClick={() =>
                setActivePage("BusinessLine")
              }
              className={`w-full p-2.5 rounded-lg text-left text-sm ${
                activePage === "BusinessLine"
                  ? "bg-amber-600 text-white"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              BusinessLine
            </button>

            <button
              onClick={() =>
                setActivePage("Macro Events")
              }
              className={`w-full p-2.5 rounded-lg text-left text-sm ${
                activePage === "Macro Events"
                  ? "bg-amber-600 text-white"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              Macro Events
            </button>

            <button
              onClick={() =>
                setActivePage("Corporate")
              }
              className={`w-full p-2.5 rounded-lg text-left text-sm ${
                activePage === "Corporate"
                  ? "bg-amber-600 text-white"
                  : "bg-zinc-900 text-zinc-300"
              }`}
            >
              Corporate
            </button>

            <button className="w-full p-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-left text-sm">
              Derivatives
            </button>

            <button className="w-full p-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-left text-sm">
              Auto Sales
            </button>

            <button className="w-full p-2.5 rounded-lg bg-zinc-900 text-zinc-300 text-left text-sm">
              Sector Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}