"use client"

import { useEffect, useMemo, useState } from "react"

type Stock = {
  symbol: string
  sector?: string
}

type Values = {
  revenue: string
  profitBeforeTax: string
  profitAfterTax: string
  employeeCost: string
  otherExpenses: string
  totalAssets: string
  cashFlow: string
  investments: string
  orderBookValue: string
  aiRevenue: string

  ebitda: string
  ebitdaMargin: string
  ebitdaPerTon: string
  production: string
  delivery: string
  netSteelRealisation: string
  rawMaterialCost: string
  inventory: string
  depreciation: string
  netDebt: string
  netDebtEbitda: string
  liquidity: string
  cashAndCashEquivalents: string
  capex: string
    nii: string
  otherIncome: string
  totalIncome: string
  operationalProfit: string
  roa: string
  roe: string
  eps: string
  deposits: string
  advances: string
  totalBusiness: string
  casa: string
  casaRatio: string
  gnpa: string
  nnpa: string
  slippageRatio: string
  creditCost: string
  pcr: string
  crar: string
  shareholdingPromoter: string
  shareholdingMutualFunds: string
  shareholdingFpi: string
  shareholdingInsurance: string
  shareholdingResidentIndividuals: string
  shareholdingOthers: string

}

const emptyValues: Values = {
  revenue: "",
  profitBeforeTax: "",
  profitAfterTax: "",
  employeeCost: "",
  otherExpenses: "",
  totalAssets: "",
  cashFlow: "",
  investments: "",
  orderBookValue: "",
  aiRevenue: "",

  ebitda: "",
  ebitdaMargin: "",
  ebitdaPerTon: "",
  production: "",
  delivery: "",
  netSteelRealisation: "",
  rawMaterialCost: "",
  inventory: "",
  depreciation: "",
  netDebt: "",
  netDebtEbitda: "",
  liquidity: "",
  cashAndCashEquivalents: "",
  capex: "",
    nii: "",
  otherIncome: "",
  totalIncome: "",
  operationalProfit: "",
  roa: "",
  roe: "",
  eps: "",
  deposits: "",
  advances: "",
  totalBusiness: "",
  casa: "",
  casaRatio: "",
  gnpa: "",
  nnpa: "",
  slippageRatio: "",
  creditCost: "",
  pcr: "",
  crar: "",
  shareholdingPromoter: "",
  shareholdingMutualFunds: "",
  shareholdingFpi: "",
  shareholdingInsurance: "",
  shareholdingResidentIndividuals: "",
  shareholdingOthers: "",

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

export default function FundamentalEntryPage() {
  const [stocks, setStocks] =
    useState<Stock[]>([])

  const [symbol, setSymbol] =
    useState("")

  const [sector, setSector] =
    useState("ALL")

  const [quarter, setQuarter] =
    useState("Q1")

  const [fy, setFy] =
    useState("FY27")

  const [values, setValues] =
    useState<Values>(emptyValues)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState("")
  const [description, setDescription] =
    useState("")

  const [descriptionOpen, setDescriptionOpen] =
    useState(false)

  useEffect(() => {
    fetch("/api/swing-fib/stocks", {
      cache: "no-store",
    })
      .then(r => r.json())
      .then(result => {
        setStocks(
          Array.isArray(result?.stocks)
            ? result.stocks
            : []
        )
      })
      .catch(() => {
        setStocks([])
      })
  }, [])

  useEffect(() => {

    setValues({
      ...emptyValues,
    })

    setDescription("")

    setMessage("")

    if (!symbol) {
      return
    }

    fetch(
      `/api/fundamental-analysis?symbol=${encodeURIComponent(symbol)}&quarter=${encodeURIComponent(quarter)}&fy=${encodeURIComponent(fy)}`,
      {
        cache: "no-store",
      }
    )
      .then(r => r.json())
      .then(result => {

        if (!result?.success) {
          return
        }

        const current =
          result.current

        if (!current) {
          return
        }

        setValues({
          revenue:
            current.revenue == null
              ? ""
              : String(current.revenue),

          profitBeforeTax:
            current.profitBeforeTax == null
              ? ""
              : String(current.profitBeforeTax),

          profitAfterTax:
            current.profitAfterTax == null
              ? ""
              : String(current.profitAfterTax),

          employeeCost:
            current.employeeCost == null
              ? ""
              : String(current.employeeCost),

          otherExpenses:
            current.otherExpenses == null
              ? ""
              : String(current.otherExpenses),

          totalAssets:
            current.totalAssets == null
              ? ""
              : String(current.totalAssets),

          cashFlow:
            current.cashFlow == null
              ? ""
              : String(current.cashFlow),

          investments:
            current.investments == null
              ? ""
              : String(current.investments),

          orderBookValue:
            current.orderBookValue == null
              ? ""
              : String(current.orderBookValue),

          aiRevenue:
            current.aiRevenue == null
              ? ""
              : String(current.aiRevenue),

          ebitda:
            current.ebitda == null
              ? ""
              : String(current.ebitda),

          ebitdaMargin:
            current.ebitdaMargin == null
              ? ""
              : String(current.ebitdaMargin),

          ebitdaPerTon:
            current.ebitdaPerTon == null
              ? ""
              : String(current.ebitdaPerTon),

          production:
            current.production == null
              ? ""
              : String(current.production),

          delivery:
            current.delivery == null
              ? ""
              : String(current.delivery),

          netSteelRealisation:
            current.netSteelRealisation == null
              ? ""
              : String(current.netSteelRealisation),

          rawMaterialCost:
            current.rawMaterialCost == null
              ? ""
              : String(current.rawMaterialCost),

          inventory:
            current.inventory == null
              ? ""
              : String(current.inventory),

          depreciation:
            current.depreciation == null
              ? ""
              : String(current.depreciation),

          netDebt:
            current.netDebt == null
              ? ""
              : String(current.netDebt),

          netDebtEbitda:
            current.netDebtEbitda == null
              ? ""
              : String(current.netDebtEbitda),

          liquidity:
            current.liquidity == null
              ? ""
              : String(current.liquidity),

          cashAndCashEquivalents:
            current.cashAndCashEquivalents == null
              ? ""
              : String(current.cashAndCashEquivalents),

          capex:
            current.capex == null
              ? ""
              : String(current.capex),
          nii:
            current.nii == null
              ? ""
              : String(current.nii),

          otherIncome:
            current.otherIncome == null
              ? ""
              : String(current.otherIncome),

          totalIncome:
            current.totalIncome == null
              ? ""
              : String(current.totalIncome),

          operationalProfit:
            current.operationalProfit == null
              ? ""
              : String(current.operationalProfit),

          roa:
            current.roa == null
              ? ""
              : String(current.roa),

          roe:
            current.roe == null
              ? ""
              : String(current.roe),

          eps:
            current.eps == null
              ? ""
              : String(current.eps),

          deposits:
            current.deposits == null
              ? ""
              : String(current.deposits),

          advances:
            current.advances == null
              ? ""
              : String(current.advances),

          totalBusiness:
            current.totalBusiness == null
              ? ""
              : String(current.totalBusiness),

          casa:
            current.casa == null
              ? ""
              : String(current.casa),

          casaRatio:
            current.casaRatio == null
              ? ""
              : String(current.casaRatio),

          gnpa:
            current.gnpa == null
              ? ""
              : String(current.gnpa),

          nnpa:
            current.nnpa == null
              ? ""
              : String(current.nnpa),

          slippageRatio:
            current.slippageRatio == null
              ? ""
              : String(current.slippageRatio),

          creditCost:
            current.creditCost == null
              ? ""
              : String(current.creditCost),

          pcr:
            current.pcr == null
              ? ""
              : String(current.pcr),

          crar:
            current.crar == null
              ? ""
              : String(current.crar),

          shareholdingPromoter:
            current.shareholdingPromoter == null
              ? ""
              : String(current.shareholdingPromoter),

          shareholdingMutualFunds:
            current.shareholdingMutualFunds == null
              ? ""
              : String(current.shareholdingMutualFunds),

          shareholdingFpi:
            current.shareholdingFpi == null
              ? ""
              : String(current.shareholdingFpi),

          shareholdingInsurance:
            current.shareholdingInsurance == null
              ? ""
              : String(current.shareholdingInsurance),

          shareholdingResidentIndividuals:
            current.shareholdingResidentIndividuals == null
              ? ""
              : String(current.shareholdingResidentIndividuals),

          shareholdingOthers:
            current.shareholdingOthers == null
              ? ""
              : String(current.shareholdingOthers),

        })

        setDescription(
          typeof current.description === "string"
            ? current.description
            : ""
        )

      })
      .catch(() => {

        setValues({
          ...emptyValues,
        })

        setDescription("")

      })

  }, [
    symbol,
    quarter,
    fy,
  ])
  const sectors = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          stocks
            .map(x => x.sector)
            .filter(Boolean) as string[]
        )
      ).sort(),
    ],
    [stocks]
  )

  const sectorStocks =
    useMemo(
      () =>
        stocks
          .filter(
            x =>
              sector === "ALL" ||
              x.sector === sector
          )
          .map(x => x.symbol)
          .sort(),
      [stocks, sector]
    )

  const selectedStock =
    stocks.find(
      x =>
        x.symbol.toUpperCase() ===
        symbol.toUpperCase()
    )

  const isIT =
    selectedStock?.sector?.toUpperCase() ===
    "IT"
    
      const isBanking =
  selectedStock?.sector?.toUpperCase() === "BANKING" ||
  selectedStock?.sector?.toUpperCase() === "PVTBANK" ||
  selectedStock?.sector?.toUpperCase() === "PSUBANK"

  function update(
    key: keyof Values,
    value: string
  ) {
    setValues(v => ({
      ...v,
      [key]: value,
    }))
  }

  async function save() {
    if (!symbol) {
      setMessage("Select a stock")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const payload: Record<string, unknown> = {
        symbol,
        quarter,
        financialYear: fy,
        description:
          description.trim()
            ? description.trim()
            : null,
      }

      for (const [key] of rows) {
        payload[key] =
          values[key] === ""
            ? null
            : Number(values[key])
      }

      const response =
        await fetch(
          "/api/fundamental-analysis",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        )

      const result =
        await response.json()

      if (!result.success) {
        throw new Error(
          result.error ??
          "Save failed"
        )
      }

      setMessage(
        `${symbol} ${quarter} ${fy} saved`
      )
    } catch (error: any) {
      setMessage(
        error?.message ??
        "Save failed"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full px-3 pt-2 pb-3">

      <div className="mb-2 flex items-center gap-2 whitespace-nowrap overflow-x-auto">

        <select
          value={symbol}
          onChange={e =>
            setSymbol(e.target.value)
          }
          className="h-9 w-52 rounded border border-slate-700 bg-transparent px-2 text-base font-semibold"
        >
          <option value="">
            Select Stock
          </option>

          {sectorStocks.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sector}
          onChange={e => {
            setSector(e.target.value)
            setSymbol("")
          }}
          className="h-9 w-36 rounded border border-slate-700 bg-transparent px-2 text-base font-semibold"
        >
          {sectors.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={quarter}
          onChange={e =>
            setQuarter(e.target.value)
          }
          className="h-9 w-24 rounded border border-slate-700 bg-transparent px-2 text-base font-semibold"
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
          className="h-9 w-24 rounded border border-slate-700 bg-transparent px-2 text-base font-semibold"
        >
          {Array.from(
            { length: 8 },
            (_, i) =>
              `FY${27 - i}`
          ).map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <span className="font-semibold">
          ₹ Crore
        </span>

      </div>

      <div className="w-full overflow-x-auto">

        <table className="w-full border-collapse text-base">

          <tbody>

            {rows.map(([key, label]) => {

              const isMetal =
                selectedStock?.sector?.toUpperCase() ===
                "METAL"

              const metalOnly =
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
              const bankingOnly =
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
                (
                  !isIT &&
                  (
                    key === "employeeCost" ||
                    key === "aiRevenue"
                  )
                ) ||
                (
                  metalOnly &&
                  !isMetal
                ) ||
                (
                  bankingOnly &&
                  !isBanking
                )
              if (hidden) return null

              return (
                <tr key={key}>
                  <td className="border border-slate-300 px-2 py-1 font-semibold text-base leading-tight">
                    {label}
                  </td>

                  <td className="border border-slate-300 px-2 py-1">
                    <input
                      type="number"
                      step="any"
                      value={values[key] ?? ""}
                      onChange={e =>
                        update(
                          key,
                          e.target.value
                        )
                      }
                      className="h-8 w-full rounded border border-slate-700 bg-transparent px-2 text-right text-base outline-none"
                    />
                  </td>
                </tr>
              )
            })}

            <tr>
              <td className="border border-slate-300 px-2 py-1 font-semibold text-base leading-tight">
                Description
              </td>

              <td className="border border-slate-300 px-2 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setDescriptionOpen(true)
                  }
                  className="font-semibold text-blue-700 underline"
                >
                  {description.trim()
                    ? "View / Edit Issues & Remarks"
                    : "Add Issues & Remarks"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

      {descriptionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setDescriptionOpen(false)
          }
        >

          <div
            className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="mb-4 flex items-center justify-between">

              <div className="text-lg font-bold">
                Issues / Remarks
              </div>

              <button
                type="button"
                onClick={() =>
                  setDescriptionOpen(false)
                }
                className="text-xl font-bold"
              >
                ×
              </button>

            </div>

            <div className="mb-2 font-semibold">
              {symbol} — {quarter} {fy}
            </div>

            <textarea
              value={description}
              onChange={e =>
                setDescription(e.target.value)
              }
              rows={8}
              placeholder="Enter issues / remarks..."
              className="w-full rounded border-2 border-slate-700 bg-transparent p-3 outline-none"
            />

            <div className="mt-4 flex justify-end">

              <button
                type="button"
                onClick={() =>
                  setDescriptionOpen(false)
                }
                className="h-10 rounded bg-slate-800 px-5 font-semibold text-white"
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}
      <div className="mt-2 flex items-center gap-2">

        <button
          onClick={save}
          disabled={saving}
          className="h-9 rounded bg-slate-800 px-4 text-base font-semibold text-white disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <span className="text-sm">
          {message}
        </span>

      </div>

    </div>
  )
}







