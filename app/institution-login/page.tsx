"use client";



export default function InstitutionLoginPage() {

  return (

    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black flex items-center justify-center p-6">

      <div className="w-full max-w-md">

        <div className="text-center mb-10">

          <div className="mx-auto w-24 h-24 rounded-xl border border-amber-500 bg-zinc-950 flex items-center justify-center text-4xl font-bold text-amber-400 shadow-lg shadow-amber-500/20">
            INST
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-wide text-white">
            INSTITUTIONAL
          </h1>

          <h2 className="text-4xl font-bold tracking-wide text-white">
            RESEARCH PLATFORM
          </h2>

          <p className="mt-4 text-zinc-400">
            Professional Market Intelligence Suite
          </p>

        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">

          <h3 className="text-center text-2xl font-semibold text-white">
            CONNECT TO ZERODHA
          </h3>

          <p className="mt-3 text-center text-zinc-500">
            Secure Kite Connect Authentication
          </p>

          <button
            onClick={() => {

              const apiKey =
                process.env.NEXT_PUBLIC_KITE_API_KEY;

              if (!apiKey) {

                alert("Kite API Key not found");

                return;

              }

              window.location.href =
                `https://kite.trade/connect/login?api_key=${apiKey}&v=3`;

            }}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-500 text-lg font-semibold text-white transition"
          >
            CONNECT BROKER
          </button>

          <div className="mt-8 space-y-3 text-sm">

            <div className="flex items-center gap-3 text-green-400">
              ✓ Secure OAuth Authentication
            </div>

            <div className="flex items-center gap-3 text-green-400">
              ✓ Live Market Data
            </div>

            <div className="flex items-center gap-3 text-green-400">
              ✓ Institutional Analytics
            </div>

          </div>

        </div>

        <div className="mt-8 text-center text-xs text-zinc-600">
          BUILD 1.0.0 &nbsp; | &nbsp; Zerodha Kite Connect &nbsp; | &nbsp; Firestore
        </div>

      </div>

    </main>

  );

}


