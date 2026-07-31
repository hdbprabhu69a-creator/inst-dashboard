"use client";

import { useEffect, useState } from "react";
import { getUniverse } from "@/lib/universe/universeService";
import { UniverseStock } from "@/lib/universe/types";

export function useUniverse() {
  const [stocks, setStocks] = useState<UniverseStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUniverse().then(setStocks).finally(() => setLoading(false));
  }, []);

  return { stocks, loading };
}

