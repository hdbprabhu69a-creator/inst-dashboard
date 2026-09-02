"use client"

import { useEffect, useMemo, useState } from "react"

type Stock = {
  symbol: string
  sector: string
}

type Row = {
  symbol: string
  sector: string
  current: Record<string, any>
  previous: Record<string, any> | null
  previousYear: Record<string, any> | null
  qoq: Record<string, number | null>
  yoy: Record<string, number | null>
  previousQuarter: {
    quarter: string
    financialYear: string
  }
}

const rows = [
  ["revenue", "Revenue"],
  ["profitBeforeTax", "Profit Before Tax"],
  ["profitAfterTax", "Profit After Tax"],
  ["employeeCost", "Employee Cost"],
  ["otherExpenses", "Other Expenses"],
  ["totalAssets", "Total Assets"],
  ["cashFlow", "Cash Flow"],
  ["investments", "Investments"],
  ["orderBookValue", "Order Book Value"],
  ["aiRevenue", "Revenue from AI"],

  ["ebitda", "EBITDA"],
  ["ebitdaMargin", "EBITDA Margin"],
  ["ebitdaPerTon", "EBITDA / ton"],
  ["production", "Production"],
  ["delivery", "Delivery"],
  ["netSteelRealisation", "Net Steel Realisation"],
  ["rawMaterialCost", "Raw Material Cost"],
  ["inventory", "Inventory"],
  ["depreciation", "Depreciation"],
  ["netDebt", "Net Debt"],
  ["netDebtEbitda", "Net Debt / EBITDA"],
  ["liquidity", "Liquidity"],
  ["cashAndCashEquivalents", "Cash & Cash Equivalents"],
  ["capex", "Capex"],

  ["nii", "NII"],
  ["otherIncome", "Other Income"],
  ["totalIncome", "Total Income"],
  ["operationalProfit", "Operational Profit"],
  ["roa", "ROA"],
  ["roe", "ROE"],
  ["eps", "EPS"],
  ["deposits", "Deposits"],
  ["advances", "Advances"],
  ["totalBusiness", "Total Business"],
  ["casa", "CASA"],
  ["casaRatio", "CASA Ratio"],
  ["gnpa", "GNPA"],
  ["nnpa", "NNPA"],
  ["slippageRatio", "Slippage Ratio"],
  ["creditCost", "Credit Cost"],
  ["pcr", "PCR"],
  ["crar", "CRAR"],
  ["shareholdingPromoter", "Promoter"],
  ["shareholdingMutualFunds", "Mutual Funds"],
  ["shareholdingFpi", "FPI"],
  ["shareholdingInsurance", "Insurance"],
  ["shareholdingResidentIndividuals", "Resident Individuals"],
  ["shareholdingOthers", "Others"],
] as const

function fmt(value: any) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    !Number.isFinite(Number(value))
  ) {
    return ""
  }

  return Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  )
}

function pct(value: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return ""
  }

  const number = Number(value)

  if (number > 0) {
    return `+${number.toFixed(2)}%`
  }

  return `${number.toFixed(2)}%`
}

function pctClass(value: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return ""
  }

  const number = Number(value)

  if (number > 0) {
    return "text-green-600"
  }

  if (number < 0) {
    return "text-red-600"
  }

  return ""
}

export default function FundamentalAnalysisPage() {

  const [stocks, setStocks] =
    useState<Stock[]>([])

  const [data, setData] =
    useState<Row[]>([])

  const [search, setSearch] =
    useState("")

  const [sector, setSector] =
    useState("ALL")

  const [quarter, setQuarter] =
    useState("Q1")

  const [fy, setFy] =
    useState("FY27")

  const [loading, setLoading] =
    useState(false)

  useEffect(() => {

    fetch(
      "/api/fundamental-analysis",
      {
        cache: "no-store",
      }
    )
      .then(r => r.json())
      .then(result => {

        if (
          result?.success &&
          Array.isArray(result.stocks)
        ) {
          setStocks(result.stocks)
        }

      })
      .catch(() => {
        setStocks([])
      })

  }, [])

  const sectors = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          stocks
            .map(x => x.sector)
            .filter(Boolean)
        )
      ).sort(),
    ],
    [stocks]
  )

  const filteredStocks =
    useMemo(
      () =>
        stocks.filter(stock => {

          const searchMatch =
            !search ||
            stock.symbol
              .toUpperCase()
              .includes(
                search.toUpperCase()
              )

          const sectorMatch =
            sector === "ALL" ||
            stock.sector === sector

          return (
            searchMatch &&
            sectorMatch
          )
        }),
      [
        stocks,
        search,
        sector,
      ]
    )

  useEffect(() => {

    let cancelled = false

    async function load() {

      setLoading(true)

      try {

        const response =
          await fetch(
            `/api/fundamental-analysis?all=true&quarter=${quarter}&fy=${fy}`,
            {
              cache: "no-store",
            }
          )

        const result =
          await response.json()

        if (
          !cancelled &&
          result?.success &&
          Array.isArray(result.rows)
        ) {
          setData(result.rows)
        } else if (!cancelled) {
          setData([])
        }

      } catch {

        if (!cancelled) {
          setData([])
        }

      } finally {

        if (!cancelled) {
          setLoading(false)
        }

      }
    }

    load()

    return () => {
      cancelled = true
    }

  }, [
    quarter,
    fy,
  ])

  const dataMap =
    useMemo(
      () =>
        new Map(
          data.map(row => [
            row.symbol,
            row,
          ])
        ),
      [data]
    )

  const visibleStocks =
    useMemo(
      () =>
        filteredStocks,
      [filteredStocks]
    )

  const previousQuarterLabel =
    data.length > 0
      ? `${data[0].previousQuarter.quarter} ${data[0].previousQuarter.financialYear}`
      : quarter === "Q1"
        ? `Q4 FY${Number(fy.replace("FY", "")) - 1}`
        : `Q${Number(quarter.substring(1)) - 1} ${fy}`

  const previousYearLabel =
    `${quarter} FY${Number(fy.replace("FY", "")) - 1}`

  const currentLabel =
    `${quarter} ${fy}`

  return (
    <div className="w-full px-4 pt-3 pb-6">

      <div className="mb-3 flex flex-wrap items-center gap-2">

        <input
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          placeholder="Search stock..."
          className="h-9 w-56 rounded border border-slate-700 bg-transparent px-3 outline-none"
        />

        {search && filteredStocks.length === 1 && (
          <span className="h-9 flex items-center px-2 text-lg font-bold">
            {filteredStocks[0].symbol.toUpperCase()}
          </span>
        )}

        <select
          value={sector}
          onChange={e =>
            setSector(e.target.value)
          }
          className="h-9 w-40 rounded border border-slate-700 bg-transparent px-2 font-semibold"
        >
          {sectors.map(item => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <select
          value={quarter}
          onChange={e =>
            setQuarter(e.target.value)
          }
          className="h-9 w-24 rounded border border-slate-700 bg-transparent px-2 font-semibold"
        >
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>

        <select
          value={fy}
          onChange={e =>
            setFy(e.target.value)
          }
          className="h-9 w-24 rounded border border-slate-700 bg-transparent px-2 font-semibold"
        >
          {Array.from(
            { length: 8 },
            (_, i) =>
              `FY${27 - i}`
          ).map(item => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <span className="text-xs text-slate-500">
          ₹ Crore
        </span>

      </div>

      <div className="w-full overflow-auto">

        <table className="w-full min-w-[1000px] border-collapse text-base">

          <thead>

            <tr className="bg-slate-800 text-white">


              <th className="border border-slate-600 px-2 py-1 text-left text-base">
                Fundamental
              </th>

              <th className="border border-slate-600 px-2 py-1 text-right text-base">
                {previousQuarterLabel}
              </th>

              <th className="border border-slate-600 px-2 py-1 text-right text-base">
                {previousYearLabel}
              </th>

              <th className="border border-slate-600 px-2 py-1 text-right text-base">
                {currentLabel}
              </th>

              <th className="border border-slate-600 px-2 py-1 text-right text-base">
                QoQ
              </th>

              <th className="border border-slate-600 px-2 py-1 text-right text-base">
                YoY
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-8 text-center"
                >
                  Loading...
                </td>

              </tr>

            ) : visibleStocks.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-8 text-center"
                >
                  No stocks found
                </td>

              </tr>

            ) : (

              visibleStocks.flatMap(stock => {

                const item =
                  dataMap.get(
                    stock.symbol
                  )

                const isIT =
                  stock.sector
                    .toUpperCase() === "IT"

                const fundamentalRows =
                  rows.map(
                    ([key, label]) => {

                      const stockSector =
                        stock.sector.toUpperCase()

                      const isIT =
                        stockSector === "IT"

                      const isMetal =
                        stockSector === "METAL"

                      const isBanking =
                        stockSector === "BANKING" ||
                        stockSector === "PVTBANK" ||
                        stockSector === "PSUBANK"

                      const metalField =
                        key === "ebitda" ||
                        key === "ebitdaMargin" ||
                        key === "ebitdaPerTon" ||
                        key === "production" ||
                        key === "delivery" ||
                        key === "netSteelRealisation" ||
                        key === "rawMaterialCost" ||
                        key === "inventory" ||
                        key === "depreciation" ||
                        key === "netDebt" ||
                        key === "netDebtEbitda" ||
                        key === "liquidity" ||
                        key === "cashAndCashEquivalents" ||
                        key === "capex"

                      const bankingField =
                        key === "nii" ||
                        key === "otherIncome" ||
                        key === "totalIncome" ||
                        key === "operationalProfit" ||
                        key === "roa" ||
                        key === "roe" ||
                        key === "eps" ||
                        key === "deposits" ||
                        key === "advances" ||
                        key === "totalBusiness" ||
                        key === "casa" ||
                        key === "casaRatio" ||
                        key === "gnpa" ||
                        key === "nnpa" ||
                        key === "slippageRatio" ||
                        key === "creditCost" ||
                        key === "pcr" ||
                        key === "crar" ||
                        key === "shareholdingPromoter" ||
                        key === "shareholdingMutualFunds" ||
                        key === "shareholdingFpi" ||
                        key === "shareholdingInsurance" ||
                        key === "shareholdingResidentIndividuals" ||
                        key === "shareholdingOthers"

                      const hidden =
                        isBanking
                          ? !bankingField
                          : (
                              (
                                !isIT &&
                                (
                                  key === "employeeCost" ||
                                  key === "aiRevenue"
                                )
                              ) ||
                              (
                                metalField &&
                                !isMetal
                              ) ||
                              (
                                bankingField &&
                                !isBanking
                              )
                            )

                      if (hidden) {
                        return null
                      }

                      return (
                        <tr
                          key={`${stock.symbol}-${key}`}
                          className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        >

                          <td className="border border-slate-300 px-2 py-1 font-semibold text-base leading-tight">
                            {label}
                          </td>

                          <td className="border border-slate-300 px-2 py-1 text-right text-base leading-tight">
                            {fmt(item?.previous?.[key])}
                          </td>

                          <td className="border border-slate-300 px-2 py-1 text-right text-base leading-tight">
                            {fmt(item?.previousYear?.[key])}
                          </td>

                          <td className="border border-slate-300 px-2 py-1 text-right font-semibold text-base leading-tight">
                            {fmt(item?.current?.[key])}
                          </td>

                          <td className="border border-slate-300 px-2 py-1 text-right text-base leading-tight">
                            <span
                              className={pctClass(
                                item?.qoq?.[key] ?? null
                              )}
                            >
                              {pct(
                                item?.qoq?.[key] ?? null
                              )}
                            </span>
                          </td>

                          <td className="border border-slate-300 px-2 py-1 text-right text-base leading-tight">
                            <span
                              className={pctClass(
                                item?.yoy?.[key] ?? null
                              )}
                            >
                              {pct(
                                item?.yoy?.[key] ?? null
                              )}
                            </span>
                          </td>

                        </tr>
                      )
                    }
                  )
                const description =
                  typeof item?.current?.description === "string"
                    ? item.current.description.trim()
                    : ""

                const descriptionRow = (
                  <tr
                    key={`${stock.symbol}-description`}
                  >

                    <td className="border border-slate-300 px-2 py-1 font-semibold text-base leading-tight">
                      Description
                    </td>

                    <td
                      colSpan={5}
                      className="border border-slate-300 px-2 py-1 text-base leading-tight whitespace-pre-wrap"
                    >
                      {description || "—"}
                    </td>

                  </tr>
                )

                return [
                  ...fundamentalRows,
                  descriptionRow,
                ]

              })

            )}

          </tbody>

        </table>

      </div>
    </div>
  )
}







