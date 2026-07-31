"use client";

import { useEffect, useState } from "react";

export function usePortfolio() {

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function load() {

      try {

        const res = await fetch("/api/portfolio/trades");

        const trades = await res.json();

        setData({

          trades: trades.data ?? []

        });

      } catch (e:any) {

        setError(e.message);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  return { data, loading, error };

}

