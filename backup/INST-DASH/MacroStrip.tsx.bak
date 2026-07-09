"use client";

import { useEffect, useState } from "react";

interface MacroData {
  nifty: number;
  niftyChange: number;

  bankNifty: number;
  bankNiftyChange: number;

  indiaVix: number;
  indiaVixChange: number;

  nasdaqFut: number;
  nasdaqFutChange: number;

  spFut: number;
  spFutChange: number;

  crude: number;
  crudeChange: number;

  dxy: number;
  dxyChange: number;

  usdinr: number;
  usdinrChange: number;

  gold: number;
  goldChange: number;

  silver: number;
  silverChange: number;
}

export default function MacroStrip() {

  const [data, setData] =
    useState<MacroData | null>(null);

  const [lastUpdate, setLastUpdate] =
    useState("");

  async function loadData() {

    try {

      await fetch(
        "/api/macro-refresh?t=" +
        Date.now()
      );

      const response =
        await fetch(
          "/api/macro-dashboard?t=" +
          Date.now()
        );

      const json =
        await response.json();

      setData(json);

      setLastUpdate(
        new Date().toLocaleTimeString()
      );

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    loadData();

    const timer =
      setInterval(
        loadData,
        5000
      );

    return () =>
      clearInterval(timer);

  }, []);

  if (!data) {

    return null;

  }

  const cards = [

    {
      title: "NIFTY",
      value: data.nifty.toFixed(0),
      change: data.niftyChange,
    },

    {
      title: "BANK",
      value: data.bankNifty.toFixed(0),
      change: data.bankNiftyChange,
    },

    {
      title: "VIX",
      value: data.indiaVix.toFixed(2),
      change: data.indiaVixChange,
    },

    {
      title: "NQ FUT",
      value: data.nasdaqFut.toFixed(0),
      change: data.nasdaqFutChange,
    },

    {
      title: "S&P FUT",
      value: data.spFut.toFixed(0),
      change: data.spFutChange,
    },

    {
      title: "CRUDE",
      value: data.crude.toFixed(2),
      change: data.crudeChange,
    },

    {
      title: "DXY",
      value: data.dxy.toFixed(2),
      change: data.dxyChange,
    },

    {
      title: "USDINR",
      value: data.usdinr.toFixed(2),
      change: data.usdinrChange,
    },

    {
      title: "GOLD",
      value: data.gold.toFixed(0),
      change: data.goldChange,
    },

    {
      title: "SILVER",
      value: data.silver.toFixed(2),
      change: data.silverChange,
    },

  ];

  return (

    <div className="space-y-1">

      <div className="flex justify-end">

        <div className="text-[10px] text-zinc-500">

          LIVE • 5 SEC • {lastUpdate}

        </div>

      </div>

      <div className="flex gap-2 overflow-hidden">

        {cards.map(
          (
            card,
            index
          ) => (

            <div
              key={index}
              className="w-[125px] bg-zinc-900 border border-zinc-800 rounded-lg p-2"
            >

              <div className="text-zinc-500 text-[10px] font-medium">

                {card.title}

              </div>

              <div
                className={`text-lg font-bold mt-1 ${
                  card.change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >

                {card.value}

              </div>

              <div
                className={`text-[11px] mt-1 ${
                  card.change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >

                {card.change > 0
                  ? "+"
                  : ""}

                {card.change.toFixed(2)}%

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}