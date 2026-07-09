"use client";

import Link from "next/link";

export default function InstitutionLoginPage() {

  return (

    <main className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl p-10">

        <div className="flex flex-col items-center">

          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-3xl font-bold text-amber-400">
            INST
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white tracking-wide">
            INSTITUTIONAL RESEARCH PLATFORM
          </h1>

          <p className="mt-2 text-zinc-400 text-sm text-center">
            Market Intelligence • Analytics • Execution
          </p>

          <div className="w-full mt-10 rounded-lg border border-zinc-800 bg-black p-8">

            <h2 className="text-lg font-semibold text-white text-center">
              Broker Authentication
            </h2>

            <p className="mt-2 text-center text-zinc-500 text-sm">
              Secure connection through Zerodha Kite Connect
            </p>

            <Link
              href="/api/login"
              className="mt-8 flex h-11 w-full items-center justify-center rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-500 transition"
            >
              CONNECT BROKER
            </Link>

          </div>

          <div className="mt-8 text-xs text-zinc-500 text-center">
            Live Market Data • Firestore • Institutional Analytics
          </div>

        </div>

      </div>

    </main>

  );

}

