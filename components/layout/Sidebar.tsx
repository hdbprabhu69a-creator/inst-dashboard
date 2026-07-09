"use client";

import Link from "next/link";

const sections = [
  {
    title: "HOME",
    items: [
      { label: "Dashboard", href: "/institutional-desk" },
    ],
  },
  {
    title: "MODULES",
    items: [
      { label: "WATCHLIST", href: "/watchlist" },
      { label: "INST", href: "/institutional-desk" },
      { label: "SCN", href: "/scanner" },
      { label: "CHART", href: "/chart" },
    ],
  },
  {
    title: "ANALYSIS",
    items: [
      { label: "DEL", href: "/delivery" },
      { label: "EOD", href: "/eod" },
      { label: "VERIFY", href: "/verify" },
      { label: "AUD", href: "/audit" },
    ],
  },
  {
    title: "MARKET",
    items: [
      { label: "BusinessLine", href: "/businessline" },
      { label: "Macro Events", href: "/macro" },
      { label: "Corporate", href: "/corporate" },
      { label: "Derivatives", href: "/derivatives" },
      { label: "Auto Sales", href: "/autosales" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black border-r border-zinc-800 text-white flex flex-col">

      <div className="px-6 py-5 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-amber-400">
          INST
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">

        {sections.map((section) => (
          <div key={section.title} className="mb-6">

            <div className="px-6 mb-2 text-xs uppercase tracking-widest text-zinc-500">
              {section.title}
            </div>

            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block mx-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-900 transition"
              >
                {item.label}
              </Link>
            ))}

          </div>
        ))}

      </div>

    </aside>
  );
}
