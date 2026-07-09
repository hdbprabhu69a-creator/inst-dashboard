"use client";

import BrokerConnectionManager from "@/components/BrokerConnectionManager";

export default function Header(){

  return(

    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6">

      <div className="flex items-center gap-4">

        <h1 className="text-xl font-bold text-amber-400">
          Institutional Research Platform
        </h1>

        <input
          type="text"
          placeholder="Search symbol..."
          className="w-80 rounded-lg border border-zinc-700 bg-black px-4 py-2 text-sm text-white outline-none"
        />

      </div>

      <BrokerConnectionManager status="connected" />

    </header>

  );

}
