"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export function useInstrumentToken(
  symbol: string
) {

  const [token, setToken] =
    useState<number>(0);

  useEffect(() => {

    async function load() {

      const snapshot =
        await getDocs(
          collection(
            db,
            "universe"
          )
        );

      const stock =
        snapshot.docs.find(
          (doc) => {

            const data =
              doc.data();

            return (
              data.symbol === symbol ||
              data.kiteSymbol === symbol
            );

          }
        );

      if (
        stock
      ) {

        setToken(
          Number(
            stock.data()
              .instrumentToken
          )
        );

      }

    }

    if (symbol) {

      load();

    }

  }, [symbol]);

  return token;

}