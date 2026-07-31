"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

interface Announcement {
  symbol: string;
  companyName: string;
  subject: string;
  summary: string;
  pdf?: string;
  announcementDate: string;
}

export default function CorporateAnnouncements() {

  const [rows,setRows]=useState<Announcement[]>([]);
  const [search,setSearch]=useState("");

  useEffect(()=>{

    const load=async()=>{

      try{

        const res=await fetch(
          "/api/corporate-announcements",
          {
            cache:"no-store"
          }
        );

        const data=await res.json();

        setRows(Array.isArray(data)?data:[]);

      }catch(err){

        console.error(err);

      }

    };

    load();

    const interval=setInterval(
      load,
      60000
    );

    return ()=>clearInterval(interval);

  },[]);

  const filteredRows = useMemo(() => {

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const parseDate = (value: string) => {

    if (!value) return 0;

    const [datePart, timePart = "00:00:00"] = value.split(" ");

    const [day, month, year] = datePart.split("-");

    const [hour, minute, second] = timePart.split(":");

    return new Date(
      Number(year),
      monthMap[month],
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    ).getTime();

  };

  return [...rows]

    .filter(row =>

      row.symbol
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      row.companyName
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      row.subject
        .toLowerCase()
        .includes(search.toLowerCase())

    )

    .sort(
      (a, b) =>
        parseDate(b.announcementDate) -
        parseDate(a.announcementDate)
    );

}, [rows, search]);

  function formatDate(value:string){

    if(!value) return "-";

    return value.split(" ")[0];

  }

  return(

    <div className="bg-black border border-zinc-800 rounded-lg">

      <div className="p-3 border-b border-zinc-800">

        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Search Symbol / Company / Subject..."
          className="w-[420px] bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
        />

      </div>

      <table className="w-full text-sm text-white">

        <thead className="bg-zinc-900 border-b border-zinc-800">

          <tr>

            <th className="text-left px-3 py-2">Date</th>

            <th className="text-left px-3 py-2">Symbol</th>

            <th className="text-left px-3 py-2">Company</th>

            <th className="text-left px-3 py-2">Subject</th>

            <th className="text-center px-3 py-2">PDF</th>

            <th className="text-left px-3 py-2">Summary</th>

          </tr>

        </thead>

        <tbody>

          {filteredRows.map((row,index)=>(

            <tr
              key={index}
              className="border-b border-zinc-900 hover:bg-zinc-950"
            >

              <td className="px-3 py-2 whitespace-nowrap text-zinc-400">
                {formatDate(row.announcementDate)}
              </td>

              <td className="px-3 py-2 text-cyan-400 font-semibold">
                {row.symbol}
              </td>

              <td className="px-3 py-2">
                {row.companyName}
              </td>

              <td className="px-3 py-2">
                {row.subject}
              </td>

              <td className="px-3 py-2 text-center">

                {row.pdf?(
                 <a
  href={row.pdf}
  target="_blank"
  rel="noreferrer"
  className="text-cyan-400 hover:text-cyan-300"
  title="Download PDF"
>
  <Download size={16} />
</a>
                ):(
                  "-"
                )}

              </td>

              <td
                className="px-3 py-2"
                title={row.summary}
              >
                {row.summary}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}






