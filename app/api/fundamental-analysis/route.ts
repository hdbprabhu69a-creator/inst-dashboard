import { NextRequest, NextResponse } from "next/server"

import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore"

import { db } from "@/lib/firebase"

type Values = {
  revenue: number | null
  profitBeforeTax: number | null
  profitAfterTax: number | null
  employeeCost: number | null
  otherExpenses: number | null
  totalAssets: number | null
  cashFlow: number | null
  investments: number | null
  orderBookValue: number | null
  aiRevenue: number | null

  ebitda: number | null
  ebitdaMargin: number | null
  ebitdaPerTon: number | null
  production: number | null
  delivery: number | null
  netSteelRealisation: number | null
  rawMaterialCost: number | null
  inventory: number | null
  depreciation: number | null
  netDebt: number | null
  netDebtEbitda: number | null
  liquidity: number | null
  cashAndCashEquivalents: number | null
  capex: number | null

  nii: number | null
  otherIncome: number | null
  totalIncome: number | null
  operationalProfit: number | null
  roa: number | null
  roe: number | null
  eps: number | null
  deposits: number | null
  advances: number | null
  totalBusiness: number | null
  casa: number | null
  casaRatio: number | null
  gnpa: number | null
  nnpa: number | null
  slippageRatio: number | null
  creditCost: number | null
  pcr: number | null
  crar: number | null
  shareholdingPromoter: number | null
  shareholdingMutualFunds: number | null
  shareholdingFpi: number | null
  shareholdingInsurance: number | null
  shareholdingResidentIndividuals: number | null
  shareholdingOthers: number | null
}

const emptyValues: Values = {
  revenue: null,
  profitBeforeTax: null,
  profitAfterTax: null,
  employeeCost: null,
  otherExpenses: null,
  totalAssets: null,
  cashFlow: null,
  investments: null,
  orderBookValue: null,
  aiRevenue: null,

  ebitda: null,
  ebitdaMargin: null,
  ebitdaPerTon: null,
  production: null,
  delivery: null,
  netSteelRealisation: null,
  rawMaterialCost: null,
  inventory: null,
  depreciation: null,
  netDebt: null,
  netDebtEbitda: null,
  liquidity: null,
  cashAndCashEquivalents: null,
  capex: null,

  nii: null,
  otherIncome: null,
  totalIncome: null,
  operationalProfit: null,
  roa: null,
  roe: null,
  eps: null,
  deposits: null,
  advances: null,
  totalBusiness: null,
  casa: null,
  casaRatio: null,
  gnpa: null,
  nnpa: null,
  slippageRatio: null,
  creditCost: null,
  pcr: null,
  crar: null,
  shareholdingPromoter: null,
  shareholdingMutualFunds: null,
  shareholdingFpi: null,
  shareholdingInsurance: null,
  shareholdingResidentIndividuals: null,
  shareholdingOthers: null,
}

function previousQuarter(
  quarter: string,
  financialYear: string
) {
  const q = Number(quarter.substring(1))
  const fy = Number(financialYear.replace("FY", ""))

  if (q === 1) {
    return {
      quarter: "Q4",
      financialYear: `FY${fy - 1}`,
    }
  }

  return {
    quarter: `Q${q - 1}`,
    financialYear,
  }
}

function previousYear(
  quarter: string,
  financialYear: string
) {
  const fy = Number(financialYear.replace("FY", ""))

  return {
    quarter,
    financialYear: `FY${fy - 1}`,
  }
}

function pct(
  current: number | null,
  previous: number | null
) {
  if (
    current == null ||
    previous == null ||
    !Number.isFinite(current) ||
    !Number.isFinite(previous) ||
    previous === 0
  ) {
    return null
  }

  return ((current - previous) / Math.abs(previous)) * 100
}

export async function GET(request: NextRequest) {
  try {
    const symbol =
      (
        request.nextUrl.searchParams.get("symbol") ?? ""
      )
        .trim()
        .toUpperCase()

    const quarter =
      request.nextUrl.searchParams.get("quarter") ?? "Q1"

    const financialYear =
      request.nextUrl.searchParams.get("fy") ?? "FY27"

    const universeSnap =
      await getDocs(
        collection(db, "universe")
      )

    /*
     * ALL STOCKS
     *
     * Return the selected quarter
     * comparison for every stock.
     */
    const allMode =
      request.nextUrl.searchParams.get("all") === "true"

    if (allMode) {

      const snap =
        await getDocs(
          collection(
            db,
            "fundamental_analysis"
          )
        )

      const records: Array<Record<string, any>> =
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))

      const output = []

      for (const stockDoc of universeSnap.docs) {

        const stock =
          stockDoc.data()

        const stockSymbol =
          String(
            stock?.symbol ?? ""
          )
            .trim()
            .toUpperCase()

        if (!stockSymbol) continue

        const stockSector =
          String(
            stock?.sector ?? ""
          )

        const currentId =
          `${stockSymbol}_${quarter}_${financialYear}`

        const previous =
          previousQuarter(
            quarter,
            financialYear
          )

        const previousYearData =
          previousYear(
            quarter,
            financialYear
          )

        const previousId =
          `${stockSymbol}_${previous.quarter}_${previous.financialYear}`

        const previousYearId =
          `${stockSymbol}_${previousYearData.quarter}_${previousYearData.financialYear}`

        const current =
          records.find(
            x => x.id === currentId
          ) ?? null

        const previousRecord =
          records.find(
            x => x.id === previousId
          ) ?? null

        const previousYearRecord =
          records.find(
            x => x.id === previousYearId
          ) ?? null

        const qoq: Record<string, number | null> = {}
        const yoy: Record<string, number | null> = {}

        for (
          const key of Object.keys(emptyValues)
        ) {

          const currentValue =
            current &&
            Number.isFinite(
              Number(current[key])
            )
              ? Number(current[key])
              : null

          const previousValue =
            previousRecord &&
            Number.isFinite(
              Number(previousRecord[key])
            )
              ? Number(previousRecord[key])
              : null

          const previousYearValue =
            previousYearRecord &&
            Number.isFinite(
              Number(
                previousYearRecord[key]
              )
            )
              ? Number(
                  previousYearRecord[key]
                )
              : null

          qoq[key] =
            pct(
              currentValue,
              previousValue
            )

          yoy[key] =
            pct(
              currentValue,
              previousYearValue
            )
        }

        output.push({
          symbol: stockSymbol,
          sector: stockSector,
          current,
          previous: previousRecord,
          previousYear:
            previousYearRecord,
          previousQuarter:
            previous,
          qoq,
          yoy,
        })
      }

      return NextResponse.json({
        success: true,
        quarter,
        financialYear,
        rows: output,
      })
    }
    /*
     * No symbol:
     * Return stock list for
     * Fundamental Analysis filters.
     */
    if (!symbol) {

      const stocks =
        universeSnap.docs
          .map(d => ({
            symbol:
              String(
                d.data()?.symbol ?? ""
              ).toUpperCase(),

            sector:
              String(
                d.data()?.sector ?? ""
              ),
          }))
          .filter(
            x => Boolean(x.symbol)
          )
          .sort(
            (a, b) =>
              a.symbol.localeCompare(
                b.symbol
              )
          )

      return NextResponse.json({
        success: true,
        stocks,
      })
    }

    const stockDoc =
      universeSnap.docs.find(
        d =>
          String(d.data()?.symbol ?? "")
            .toUpperCase() === symbol
      )

    if (!stockDoc) {
      return NextResponse.json({
        success: false,
        error: "Stock not found",
      })
    }

    const sector =
      String(stockDoc.data()?.sector ?? "")

    const currentId =
      `${symbol}_${quarter}_${financialYear}`

    const previous =
      previousQuarter(
        quarter,
        financialYear
      )

    const previousYearRecord =
      previousYear(
        quarter,
        financialYear
      )

    const previousId =
      `${symbol}_${previous.quarter}_${previous.financialYear}`

    const previousYearId =
      `${symbol}_${previousYearRecord.quarter}_${previousYearRecord.financialYear}`

    const snap =
      await getDocs(
        collection(
          db,
          "fundamental_analysis"
        )
      )

    const records: Array<Record<string, any>> =
      snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }))

    const current =
      records.find(
        x => x.id === currentId
      ) ?? {
        id: currentId,
        symbol,
        sector,
        quarter,
        financialYear,
        ...emptyValues,
      }

    const previousRecord =
      records.find(
        x => x.id === previousId
      ) ?? null

    const previousYearData =
      records.find(
        x => x.id === previousYearId
      ) ?? null

    const qoq: Record<string, number | null> = {}
    const yoy: Record<string, number | null> = {}

    for (const key of Object.keys(emptyValues)) {
      const currentValue =
        Number.isFinite(Number(current[key]))
          ? Number(current[key])
          : null

      const previousValue =
        previousRecord &&
        Number.isFinite(
          Number(previousRecord[key])
        )
          ? Number(previousRecord[key])
          : null

      const previousYearValue =
        previousYearData &&
        Number.isFinite(
          Number(previousYearData[key])
        )
          ? Number(previousYearData[key])
          : null

      qoq[key] =
        pct(
          currentValue,
          previousValue
        )

      yoy[key] =
        pct(
          currentValue,
          previousYearValue
        )
    }

    return NextResponse.json({
      success: true,
      symbol,
      sector,
      quarter,
      financialYear,
      current,
      previous: previousRecord,
      previousYear: previousYearData,
      previousQuarter: previous,
      qoq,
      yoy,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          String(error),
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()
    const description =
      body.description == null
        ? null
        : String(body.description).trim()

    const symbol =
      String(body.symbol ?? "")
        .trim()
        .toUpperCase()

    const quarter =
      String(body.quarter ?? "")

    const financialYear =
      String(body.financialYear ?? "")

    if (
      !symbol ||
      !["Q1", "Q2", "Q3", "Q4"].includes(quarter) ||
      !/^FY\d+$/.test(financialYear)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid stock, quarter or FY",
        },
        { status: 400 }
      )
    }

    const universeSnap =
      await getDocs(
        collection(db, "universe")
      )

    const stockDoc =
      universeSnap.docs.find(
        d =>
          String(d.data()?.symbol ?? "")
            .toUpperCase() === symbol
      )

    if (!stockDoc) {
      return NextResponse.json(
        {
          success: false,
          error: "Stock not found",
        },
        { status: 404 }
      )
    }

    const sector =
      String(stockDoc.data()?.sector ?? "")

    const values: Values = {
      revenue:
        body.revenue == null
          ? null
          : Number(body.revenue),

      profitBeforeTax:
        body.profitBeforeTax == null
          ? null
          : Number(body.profitBeforeTax),

      profitAfterTax:
        body.profitAfterTax == null
          ? null
          : Number(body.profitAfterTax),

      employeeCost:
        body.employeeCost == null
          ? null
          : Number(body.employeeCost),

      otherExpenses:
        body.otherExpenses == null
          ? null
          : Number(body.otherExpenses),

      totalAssets:
        body.totalAssets == null
          ? null
          : Number(body.totalAssets),

      cashFlow:
        body.cashFlow == null
          ? null
          : Number(body.cashFlow),

      investments:
        body.investments == null
          ? null
          : Number(body.investments),

      orderBookValue:
        body.orderBookValue == null
          ? null
          : Number(body.orderBookValue),

      aiRevenue:
        body.aiRevenue == null
          ? null
          : Number(body.aiRevenue),

      ebitda:
        body.ebitda == null
          ? null
          : Number(body.ebitda),

      ebitdaMargin:
        body.ebitdaMargin == null
          ? null
          : Number(body.ebitdaMargin),

      ebitdaPerTon:
        body.ebitdaPerTon == null
          ? null
          : Number(body.ebitdaPerTon),

      production:
        body.production == null
          ? null
          : Number(body.production),

      delivery:
        body.delivery == null
          ? null
          : Number(body.delivery),

      netSteelRealisation:
        body.netSteelRealisation == null
          ? null
          : Number(body.netSteelRealisation),

      rawMaterialCost:
        body.rawMaterialCost == null
          ? null
          : Number(body.rawMaterialCost),

      inventory:
        body.inventory == null
          ? null
          : Number(body.inventory),

      depreciation:
        body.depreciation == null
          ? null
          : Number(body.depreciation),

      netDebt:
        body.netDebt == null
          ? null
          : Number(body.netDebt),

      netDebtEbitda:
        body.netDebtEbitda == null
          ? null
          : Number(body.netDebtEbitda),

      liquidity:
        body.liquidity == null
          ? null
          : Number(body.liquidity),

      cashAndCashEquivalents:
        body.cashAndCashEquivalents == null
          ? null
          : Number(body.cashAndCashEquivalents),

      capex:
        body.capex == null
          ? null
          : Number(body.capex),

      nii:
        body.nii == null
          ? null
          : Number(body.nii),

      otherIncome:
        body.otherIncome == null
          ? null
          : Number(body.otherIncome),

      totalIncome:
        body.totalIncome == null
          ? null
          : Number(body.totalIncome),

      operationalProfit:
        body.operationalProfit == null
          ? null
          : Number(body.operationalProfit),

      roa:
        body.roa == null
          ? null
          : Number(body.roa),

      roe:
        body.roe == null
          ? null
          : Number(body.roe),

      eps:
        body.eps == null
          ? null
          : Number(body.eps),

      deposits:
        body.deposits == null
          ? null
          : Number(body.deposits),

      advances:
        body.advances == null
          ? null
          : Number(body.advances),

      totalBusiness:
        body.totalBusiness == null
          ? null
          : Number(body.totalBusiness),

      casa:
        body.casa == null
          ? null
          : Number(body.casa),

      casaRatio:
        body.casaRatio == null
          ? null
          : Number(body.casaRatio),

      gnpa:
        body.gnpa == null
          ? null
          : Number(body.gnpa),

      nnpa:
        body.nnpa == null
          ? null
          : Number(body.nnpa),

      slippageRatio:
        body.slippageRatio == null
          ? null
          : Number(body.slippageRatio),

      creditCost:
        body.creditCost == null
          ? null
          : Number(body.creditCost),

      pcr:
        body.pcr == null
          ? null
          : Number(body.pcr),

      crar:
        body.crar == null
          ? null
          : Number(body.crar),

      shareholdingPromoter:
        body.shareholdingPromoter == null
          ? null
          : Number(body.shareholdingPromoter),

      shareholdingMutualFunds:
        body.shareholdingMutualFunds == null
          ? null
          : Number(body.shareholdingMutualFunds),

      shareholdingFpi:
        body.shareholdingFpi == null
          ? null
          : Number(body.shareholdingFpi),

      shareholdingInsurance:
        body.shareholdingInsurance == null
          ? null
          : Number(body.shareholdingInsurance),

      shareholdingResidentIndividuals:
        body.shareholdingResidentIndividuals == null
          ? null
          : Number(body.shareholdingResidentIndividuals),

      shareholdingOthers:
        body.shareholdingOthers == null
          ? null
          : Number(body.shareholdingOthers),
    }

    if (sector.toUpperCase() !== "IT") {
      values.employeeCost = null
      values.aiRevenue = null
    }

    if (sector.toUpperCase() !== "METAL") {
      values.ebitda = null
      values.ebitdaMargin = null
      values.ebitdaPerTon = null
      values.production = null
      values.delivery = null
      values.netSteelRealisation = null
      values.rawMaterialCost = null
      values.inventory = null
      values.depreciation = null
      values.netDebt = null
      values.netDebtEbitda = null
      values.liquidity = null
      values.cashAndCashEquivalents = null
      values.capex = null
    }

    if (
  !["BANKING", "PVTBANK", "PSUBANK"].includes(
    sector.toUpperCase()
  )
)  {
      values.nii = null
      values.otherIncome = null
      values.totalIncome = null
      values.operationalProfit = null
      values.roa = null
      values.roe = null
      values.eps = null
      values.deposits = null
      values.advances = null
      values.totalBusiness = null
      values.casa = null
      values.casaRatio = null
      values.gnpa = null
      values.nnpa = null
      values.slippageRatio = null
      values.creditCost = null
      values.pcr = null
      values.crar = null
      values.shareholdingPromoter = null
      values.shareholdingMutualFunds = null
      values.shareholdingFpi = null
      values.shareholdingInsurance = null
      values.shareholdingResidentIndividuals = null
      values.shareholdingOthers = null
    }

    const id =
      `${symbol}_${quarter}_${financialYear}`

    await setDoc(
      doc(
        db,
        "fundamental_analysis",
        id
      ),
      {
        symbol,
        sector,
        quarter,
        financialYear,
        ...values,
        description,
        updatedAt: new Date(),
      },
      {
        merge: true,
      }
    )

    return NextResponse.json({
      success: true,
      id,
      symbol,
      sector,
      quarter,
      financialYear,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          String(error),
      },
      {
        status: 500,
      }
    )
  }
}






