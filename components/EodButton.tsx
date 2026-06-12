"use client";

import { useState } from "react";

export default function EodButton() {

  const [loading, setLoading] =
    useState(false);

  const runEod =
    async () => {

      const confirmed =
        window.confirm(
          "Run End Of Day Update?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/market-structure-bulk-v2"
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.error ||
            "EOD Update Failed"
          );

        }

        alert(
          `EOD Update Completed

Updated: ${data.updated}
Ignored: ${data.ignored}
Failed: ${data.failed}`
        );

      } catch (error: any) {

        console.error(
          "EOD ERROR:",
          error
        );

        alert(
          error.message ||
          "EOD Update Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <button
      onClick={runEod}
      disabled={loading}
      className="
        px-2
        py-1
        h-7
        rounded-md
        bg-cyan-600
        hover:bg-cyan-500
        text-white
        text-xs
        font-medium
        flex
        items-center
        disabled:opacity-50
      "
    >

      {
        loading
          ? "RUN..."
          : "EOD"
      }

    </button>

  );

}