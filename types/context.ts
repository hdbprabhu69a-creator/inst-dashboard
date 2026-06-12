import {
  MarketStructure,
} from "@/types/market";

export interface SelectedStockContextType {

  selectedStock: string;

  setSelectedStock: (
    symbol: string
  ) => void;

  marketStructure:
    MarketStructure | null;

  marketStructureLoading:
    boolean;

}