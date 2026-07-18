"use client";

import { useEffect, useState } from "react";

export function useOrders() {
  const [data, setData] = useState<{
    open: any[];
    completed: any[];
  }>({
    open: [],
    completed: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/portfolio/orders")
      .then((r) => r.json())
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
