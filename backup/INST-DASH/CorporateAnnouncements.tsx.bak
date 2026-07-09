"use client";

import { useEffect, useMemo, useState } from "react";

interface Announcement {
  date: string;
  stock: string;
  summary: string;
  attachment?: string;
}

export default function CorporateAnnouncements() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "/api/corporate-announcements",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();
        setRows(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    const interval = setInterval(
      load,
      60000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      row.stock
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [rows, search]);

  const formatDate = (
    date: string
  ) => {
    if (!date) return "";

    return date
      .split(" ")[0]
      .replace(
        /-\d{4}/,
        ""
      );
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-lg">

      <div className="p-2 border-b border-zinc-800">

        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search Stock..."
          className="
            w-[300px]
            bg-zinc-900
            border
            border-zinc-700
            rounded
            px-3
            py-2
            text-white
            text-sm
            outline-none
          "
        />

      </div>

      <table className="w-full text-[12px] text-white">

        <thead className="border-b border-zinc-800">

          <tr>

            <th className="text-left px-3 py-2 w-[90px]">
              Date
            </th>

            <th className="text-left px-3 py-2 w-[120px]">
              Stock
            </th>

            <th className="text-center px-3 py-2 w-[60px]">
              PDF
            </th>

            <th className="text-left px-3 py-2">
              Summary
            </th>

          </tr>

        </thead>

        <tbody>

          {filteredRows.map(
            (
              row,
              index
            ) => (
              <tr
                key={index}
                className="border-b border-zinc-900 hover:bg-zinc-950"
              >

                <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">
                  {formatDate(
                    row.date
                  )}
                </td>

                <td className="px-3 py-2 text-cyan-400 whitespace-nowrap">
                  {row.stock}
                </td>

                <td className="px-3 py-2 text-center">

                  {row.attachment ? (
                    <a
                      href={
                        row.attachment
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400"
                    >
                      📄
                    </a>
                  ) : (
                    "-"
                  )}

                </td>

                <td
                  className="px-3 py-2 text-zinc-200 truncate"
                  title={
                    row.summary
                  }
                >
                  {row.summary}
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}