"use client";

import { useEffect, useState } from "react";

interface EventItem {
  title: string;
  date: string;
  impact: string;
}

export default function MajorEventTracker() {

  const [events, setEvents] =
    useState<EventItem[]>([]);

  useEffect(() => {

    async function load() {

      const response =
        await fetch("/api/event-calendar");

      const json =
        await response.json();

      const sorted =
        [...(json.events || [])].sort(
          (a, b) => {

            const currentYear =
              new Date().getFullYear();

            const dateA =
              new Date(
                `${a.date}-${currentYear}`
              );

            const dateB =
              new Date(
                `${b.date}-${currentYear}`
              );

            return (
              dateA.getTime() -
              dateB.getTime()
            );

          }
        );

      setEvents(sorted);

    }

    load();

  }, []);

  return (

    <div className="p-3">

      {events.map(
        (
          event,
          index
        ) => (

          <div
            key={index}
            className="flex items-center justify-between border-b border-zinc-800 py-4"
          >

            <div className="flex items-center gap-3">

              <div
                className={`w-3 h-3 rounded-full ${
                  event.impact === "HIGH"
                    ? "bg-red-500"
                    : event.impact === "MEDIUM"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />

              <div className="text-white text-lg">

                {event.title}

              </div>

            </div>

            <div className="flex items-center gap-6">

              <div
                className={`font-semibold ${
                  event.impact === "HIGH"
                    ? "text-red-400"
                    : event.impact === "MEDIUM"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >

                {event.impact}

              </div>

              <div className="text-amber-400 text-lg font-semibold">

                {event.date}

              </div>

            </div>

          </div>

        )
      )}

    </div>

  );

}
