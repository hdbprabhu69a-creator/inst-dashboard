"use client";

import { useEffect } from "react";

import { app } from "@/lib/firebase";
import { kite } from "@/lib/kite";

import SearchBox from "@/components/SearchBox";
import BrokerConnectionManager from "@/components/BrokerConnectionManager";
import MarketSnapshot from "@/components/MarketSnapshot";
import PivotStructure from "@/components/PivotStructure";
import MarketHistoryTable from "@/components/MarketHistoryTable";

export default function Home() {

  useEffect(() => {

    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const requestToken =
      params.get(
        "request_token"
      );

    if (requestToken) {

      console.log(
        "REQUEST TOKEN:",
        requestToken
      );

      window.location.replace(
        `/api/token?request_token=${requestToken}`
      );

    }

  }, []);

  console.log(
    "SERVER ENV =",
    process.env.NEXT_PUBLIC_KITE_API_KEY
  );

  console.log(app);
  console.log(kite);

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="p-2">

        <div className="space-y-1">

          <div className="flex justify-between items-center mb-1">

            <SearchBox />

            <BrokerConnectionManager />

          </div>

          <MarketSnapshot />

          <PivotStructure />

          <MarketHistoryTable />

        </div>

      </section>

    </main>

  );

}