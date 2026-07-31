"use client";

import { useState } from "react";

export default function DeliveryImportButton() {

  const [loading, setLoading] =
    useState(false);

  async function runImport() {

    const confirmed =
      window.confirm(
        "Import latest delivery CSV?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/delivery-bulk"
        );

      const data =
        await response.json();

      if (!data.success) {

        alert(
          data.error ||
          "Delivery Import Failed"
        );

        return;

      }

      alert(

`Delivery Import Complete

File: ${data.file}

Written: ${data.written}

Skipped: ${data.skipped}`

      );

    } catch (error: any) {

      console.error(error);

      alert(
        error.message ||
        "Import Failed"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <button
      onClick={runImport}
      disabled={loading}
      className="
        px-2
        py-0.5
        h-6
        rounded-md
        bg-orange-600
        hover:bg-orange-500
        text-white
        text-[11px]
        font-medium
        flex
        items-center
        disabled:opacity-50
      "
    >

      {
        loading
          ? "IMP..."
          : "DEL"
      }

    </button>

  );

}
