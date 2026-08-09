"use client";

interface Props {

  search: string;
  setSearch: (v: string) => void;

  sectorFilter: string;
  setSectorFilter: (v: string) => void;

  sectorList: string[];

  swingFilter: string;
  setSwingFilter: (v: string) => void;

  volPeriod: string;
  setVolPeriod: (v: string) => void;

  filtered: number;
  total: number;
}

export default function Toolbar({

  search,
  setSearch,

  sectorFilter,
  setSectorFilter,

  sectorList,

  swingFilter,
  setSwingFilter,

  volPeriod,
  setVolPeriod,

  filtered,
  total,

}: Props) {

  return (

    <div className="
  bg-[#111315]
      flex
      flex-wrap
      items-center
      gap-2
      p-2
    ">

      <input
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
        placeholder="Search Symbol..."
        className="
          w-60
          rounded
          border
          border-zinc-700
          bg-black
          px-3
          py-2
          text-cyan-300
          outline-none
          placeholder:text-zinc-600
        "
      />

      <select
        value={sectorFilter}
        onChange={e =>
          setSectorFilter(e.target.value)
        }
        className="
          rounded
          border
          border-zinc-700
          bg-black
          px-3
          py-2
          text-yellow-300
        "
      >

        {sectorList.map(
          sector => (
            <option
              key={sector}
              value={sector}
            >
              {sector}
            </option>
          )
        )}

      </select>

      <select
        value={swingFilter}
        onChange={e =>
          setSwingFilter(e.target.value)
        }
        className="
          rounded
          border
          border-zinc-700
          bg-black
          px-3
          py-2
          text-lime-300
        "
      >

        <option value="ALL">
          ALL
        </option>

        <option value="1W">
          1W
        </option>

        <option value="2W">
          2W
        </option>

        <option value="1M">
          1M
        </option>

        <option value="3M">
          3M
        </option>

        <option value="6M">
          6M
        </option>

        <option value="1Y">
          1Y
        </option>

        <option value="PIVOT">
          PIVOT
        </option>

        <option value="VOLDEL">
          VOL / DEL
        </option>

        <option value="VALUE_BUY">
          VALUE BUY
        </option>

    <option value="WATCHLIST">
      WATCHLIST
    </option>

      </select>

      {swingFilter === "VOLDEL" && (

        <select
          value={volPeriod}
          onChange={e =>
            setVolPeriod(e.target.value)
          }
          className="
            rounded-md
            border
            border-zinc-700
            bg-black
            px-4
            py-2
            text-lime-300
          "
        >

          <option value="1W">
            1W
          </option>

          <option value="2W">
            2W
          </option>

          <option value="1M">
            1M
          </option>

        </select>

      )}

      <button
        className="
          rounded
          border
          border-cyan-700
          bg-cyan-900
          px-4
          py-2
          font-semibold
          text-cyan-200
          hover:bg-cyan-800
        "
      >
        Export CSV
      </button>

  <span className="
    text-[11px]
    text-gray-400
  ">
    {swingFilter === "WATCHLIST"
      ? `${filtered} stocks`
      : `Showing ${filtered} / ${total}`}
  </span>

    </div>

  );
}


