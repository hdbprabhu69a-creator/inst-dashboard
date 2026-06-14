"use client";

import { useEffect } from "react";

import { kite } from "@/lib/kite";

import Link from "next/link";

import SearchBox from "@/components/SearchBox";
import BrokerConnectionManager from "@/components/BrokerConnectionManager";
import MarketSnapshot from "@/components/MarketSnapshot";
import EodButton from "@/components/EodButton";
import VerifyButton from "@/components/VerifyButton";

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

      window.location.replace(
        `/api/token?request_token=${requestToken}`
      );

    }

  }, []);

  console.log(kite);

  return (

    <SelectedStockProvider>

      <main className="min-h-screen bg-black text-white">

        <section className="p-1">

          <div className="space-y-1">

            <div className="flex justify-between items-center">

              <div className="flex items-center gap-1">

                <SearchBox />

                <Link
                  href="/heatmap"
                  className="
                    px-2
                    py-0.5
                    h-6
                    rounded-md
                    bg-cyan-600
                    hover:bg-cyan-500
                    text-white
                    text-[11px]
                    font-medium
                    flex
                    items-center
                  "
                >
                  HM
                </Link>

                <Link
                  href="/scanner"
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
                  SCN
                </Link>

                <EodButton />

                <VerifyButton />

                <a
                  href="/api/market-structure-audit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    px-2
                    py-0.5
                    h-6
                    rounded-md
                    bg-cyan-600
                    hover:bg-cyan-500
                    text-white
                    text-[11px]
                    font-medium
                    flex
                    items-center
                  "
                >
                  AUD
                </a>

              </div>

              <BrokerConnectionManager />

            </div>

            <MarketSnapshot />

            <div className="grid grid-cols-12 gap-1">

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

            <div className="flex gap-1 items-start">

              <div className="w-[42%]">
                <SwingTable />
              </div>

              <div className="flex-1">
                <FibTable />
              </div>

            </div>

          </div>

        </section>

      </main>

    </SelectedStockProvider>

  );

}