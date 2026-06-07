"use client";

import { useEffect } from "react";

import { app } from "@/lib/firebase";
import { kite } from "@/lib/kite";

import Link from "next/link";

import SearchBox from "@/components/SearchBox";
import BrokerConnectionManager from "@/components/BrokerConnectionManager";
import MarketSnapshot from "@/components/MarketSnapshot";

import PivotTable from "@/components/PivotTable";
import CPRTable from "@/components/CPRTable";
import VWAPTable from "@/components/VWAPTable";
import VolumeTable from "@/components/VolumeTable";
import SwingTable from "@/components/SwingTable";
import FibTable from "@/components/FibTable";

import {
  SelectedStockProvider,
} from "@/src/context/SelectedStockContext";

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

  console.log(app);
  console.log(kite);

  return (

    <SelectedStockProvider>

      <main className="min-h-screen bg-black text-white">

        <section className="p-2">

          <div className="space-y-2">

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-2">

                <SearchBox />

                <Link
                  href="/heatmap"
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-cyan-600
                    hover:bg-cyan-500
                    text-white
                    text-sm
                    font-semibold
                  "
                >
                  HeatMap
                </Link>

              </div>

              <BrokerConnectionManager />

            </div>

            <MarketSnapshot />

            <div className="grid grid-cols-12 gap-2">

  <div className="col-span-4">
    <PivotTable />
  </div>

  <div className="col-span-2">
    <CPRTable />
  </div>

  <div className="col-span-2">
    <VWAPTable />
  </div>

  <div className="col-span-4">
    <VolumeTable />
  </div>

</div>

            <SwingTable />

            <FibTable />

          </div>

        </section>

      </main>

    </SelectedStockProvider>

  );

}