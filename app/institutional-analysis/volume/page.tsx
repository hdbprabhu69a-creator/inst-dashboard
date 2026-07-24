"use client";

import { useEffect, useState } from "react";
import VolumeGrid from "@/institutional-analysis/components/VolumeGrid";
import { VolumeAnalysisResult } from "@/institutional-analysis/engine/volume";

export default function VolumePage() {

  const [data, setData] = useState<VolumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function load() {

      try {

        const res = await fetch("/api/institutional-analysis/volume?symbol=SBIN");
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error);
        }

        setData(json.data);

      } catch (err) {

        setError(err instanceof Error ? err.message : "Unknown error");

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!data) return <div>No data.</div>;

  return <VolumeGrid data={[data]} />;

}

