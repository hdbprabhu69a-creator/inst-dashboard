"use client";

import { Bell, ChevronDown, Search, User } from "lucide-react";

export default function PortfolioHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1f2a37] bg-[#101720]">
      <div className="flex h-16 items-center justify-between px-8">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Portfolio Management
          </h1>

          <p className="text-sm text-slate-400">
            Institutional Portfolio Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 -translate-x-0 text-slate-500"
            />

            <input
              placeholder="Search..."
              className="w-72 rounded-xl border border-[#253344] bg-[#121a24] py-2 pl-10 pr-4 text-sm outline-none focus:border-cyan-400"
            />

          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#253344] bg-[#121a24] hover:bg-[#1b2532]">
            <Bell size={18}/>
          </button>

          <button className="flex items-center gap-3 rounded-xl border border-[#253344] bg-[#121a24] px-3 py-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500">
              <User size={18}/>
            </div>

            <div className="text-left">
              <div className="text-sm font-semibold">
                Portfolio
              </div>

              <div className="text-xs text-slate-400">
                LIVE
              </div>
            </div>

            <ChevronDown size={16}/>

          </button>

        </div>

      </div>
    </header>
  );
}
