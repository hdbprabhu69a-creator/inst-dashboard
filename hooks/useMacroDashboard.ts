"use client";

import { useEffect, useState } from "react";

export function useMacroDashboard() {

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {

    async function load() {

      const response =
        await fetch(
          "/api/macro-dashboard"
        );

      const json =
        await response.json();

      setData(json);

    }

    load();

  }, []);

  return data;

}