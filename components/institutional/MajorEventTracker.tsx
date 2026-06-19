"use client";

import {
  useEffect,
  useState,
} from "react";

interface EventItem {

  title: string;

  date: string;

  impact: string;

}

export default function MajorEventTracker() {

  const [
    events,
    setEvents,
  ] = useState<EventItem[]>([]);

  useEffect(() => {

    async function load() {

      const response =
        await fetch(
          "/api/event-calendar"
        );

      const json =
        await response.json();

      setEvents(
        json.events || []
      );

    }

    load();

  }, []);

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-[650px]">

      <div className="flex items-center justify-between mb-4">

        <h2 className="text-xl font-bold text-orange-100">

          Major Events

        </h2>

        <span className="text-green-400 text-sm font-semibold">

          LIVE

        </span>

      </div>

      <div className="space-y-2">

        {events.map(
          (
            event,
            index
          ) => (

            <div
              key={index}
              className="border-b border-zinc-800 py-3"
            >

              <div className="flex justify-between items-center">

                <div>

                  <div className="text-orange-100 text-lg">

                    {event.title}

                  </div>

                  <div
                    className={`text-xs font-semibold mt-1 ${
                      event.impact === "HIGH"
                        ? "text-red-400"
                        : event.impact === "MEDIUM"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >

                    {event.impact}

                  </div>

                </div>

                <div className="text-yellow-400 text-lg font-semibold">

                  {event.date}

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}