export type FundamentalValues = {
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

export type FundamentalRecord =
  FundamentalValues & {
    id: string
    symbol: string
    sector: string
    quarter:
      | "Q1"
      | "Q2"
      | "Q3"
      | "Q4"
    financialYear: string
    updatedAt?: unknown
  }

export const FUNDAMENTAL_ROWS = [
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

export function comparisonPercent(
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

  return (
    ((current - previous) /
      Math.abs(previous)) *
    100
  )
}