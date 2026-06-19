import MacroStrip from "@/components/institutional/MacroStrip";

import BusinesslineFeed from "@/components/institutional/BusinesslineFeed";

import MajorEventTracker from "@/components/institutional/MajorEventTracker";

import CorporateAnnouncements from "@/components/institutional/CorporateAnnouncements";

export default function InstitutionalDesk() {

  return (

    <div className="min-h-screen bg-black p-2 space-y-2">

      <MacroStrip />

      <div className="grid grid-cols-12 gap-2">

        <div className="col-span-5">

          <BusinesslineFeed />

        </div>

        <div className="col-span-3">

          <MajorEventTracker />

        </div>

        <div className="col-span-4">

          <CorporateAnnouncements />

        </div>

      </div>

    </div>

  );

}