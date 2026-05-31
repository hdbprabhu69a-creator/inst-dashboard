"use client";

export default function SwingFibCard() {

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">

      <h2 className="text-cyan-400 text-xl font-bold mb-4">
        SWING + FIB
      </h2>

      <div className="space-y-2 text-sm">

        <div>1W : 296 / 285</div>
        <div>2W : 301 / 283</div>
        <div>1M : 322 / 275</div>
        <div>3M : 326 / 255</div>
        <div>6M : -</div>
        <div>1Y : -</div>

      </div>

      <div className="border-t border-zinc-800 mt-4 pt-4">

        <div>23.6 : 287</div>
        <div>38.2 : 290</div>
        <div>50.0 : 292</div>
        <div>61.8 : 294</div>
        <div>76.4 : 297</div>

      </div>

    </div>

  );
}