"use client";

export default function PivotCard() {

  const pivots = [
    {
      tf: "PD",
      pivot: 291,
      r1: 297,
      s1: 287,
    },
    {
      tf: "CD",
      pivot: 293,
      r1: 299,
      s1: 290,
    },
    {
      tf: "PW",
      pivot: 291,
      r1: 300,
      s1: 282,
    },
    {
      tf: "CW",
      pivot: 294,
      r1: 301,
      s1: 286,
    },
    {
      tf: "PM",
      pivot: 291,
      r1: 306,
      s1: 276,
    },
    {
      tf: "CM",
      pivot: 296,
      r1: 308,
      s1: 281,
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">

      <h2 className="text-blue-400 text-xl font-bold mb-4">
        PIVOT STRUCTURE
      </h2>

      <table className="w-full">

        <thead>
          <tr className="text-zinc-500">
            <th className="text-left p-2">TF</th>
            <th className="text-left p-2">Pivot</th>
            <th className="text-left p-2">R1</th>
            <th className="text-left p-2">S1</th>
          </tr>
        </thead>

        <tbody>

          {pivots.map((row) => (

            <tr
              key={row.tf}
              className="border-t border-zinc-800"
            >
              <td className="p-2">
                {row.tf}
              </td>

              <td className="p-2">
                {row.pivot}
              </td>

              <td className="p-2 text-green-400">
                {row.r1}
              </td>

              <td className="p-2 text-red-400">
                {row.s1}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
