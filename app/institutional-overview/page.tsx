"use client";

import TopGainers from "@/components/institutional/overview/TopGainers";
import MarketBreadth from "@/components/institutional/overview/MarketBreadth";
import InstitutionalBreakout from "@/components/institutional/overview/InstitutionalBreakout";
import SectorPerformance from "@/components/institutional/overview/SectorPerformance";

export default function InstitutionalOverview(){

  return(

    <main className="min-h-screen bg-black p-3 text-white">

      {/* Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">

        <section className="rounded-xl border border-[#1f2937] bg-[#080d14] p-3 lg:col-span-2">

          <InstitutionalBreakout />

        </section>

        <section className="rounded-xl border border-[#1f2937] bg-[#080d14] p-3">

          <TopGainers />

        </section>

      </div>

      {/* Row 2 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">

        <section className="rounded-xl border border-[#1f2937] bg-[#080d14] p-3">

          <MarketBreadth />

        </section>

        <section className="rounded-xl border border-[#1f2937] bg-[#080d14] p-3 lg:col-span-2">
  <SectorPerformance />
</section>

      </div>

    </main>

  );

}

