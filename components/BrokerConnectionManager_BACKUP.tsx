"use client";

import { useEffect, useState } from "react";

type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "expired";

export default function BrokerConnectionManager({
  status = "connected",
}: {
  status?: ConnectionStatus;
}) {

  const apiKey =
    process.env.NEXT_PUBLIC_KITE_API_KEY;

  const [statusTime, setStatusTime] =
    useState("");

  useEffect(() => {

    const updateTime = () => {

      const now = new Date();

      const weekday =
        now.toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
          }
        );

      const day =
        now.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
          }
        );

      const month =
        now.toLocaleDateString(
          "en-IN",
          {
            month: "short",
          }
        );

      const time =
        now.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );

      setStatusTime(
        `${weekday} ${day}-${month} â€¢ ${time}`
      );

    };

    updateTime();

    const interval =
      setInterval(
        updateTime,
        60000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const reconnect = () => {

    if (!apiKey) {

      alert(
        "Kite API Key not found"
      );

      return;

    }

    window.location.href =
      `https://kite.trade/connect/login?api_key=${apiKey}&v=3`;

  };

  const statusConfig = {

    connected: {
      icon: "ðŸŸ¢",
      text: "LIVE",
      color: "text-green-400",
    },

    disconnected: {
      icon: "ðŸ”´",
      text: "OFFLINE",
      color: "text-red-400",
    },

    expired: {
      icon: "ðŸŸ¡",
      text: "EXPIRED",
      color: "text-yellow-400",
    },

  };

  const current =
    statusConfig[status];

  return (

    <div className="flex items-center gap-4">

      <p
        className={`
          text-sm
          font-semibold
          whitespace-nowrap
          ${current.color}
        `}
      >
        {current.icon}
        {" "}
        {current.text}
        {" â€¢ "}
        {statusTime}
      </p>

      <button
        onClick={reconnect}
        className="
          bg-green-600
          hover:bg-green-700
          px-4
          py-2
          rounded-xl
          text-sm
          font-medium
          transition
        "
      >
        Reconnect
      </button>

    </div>

  );

}
