import { STOCK_UNIVERSE } from "@/lib/universe";
import { CorporateAnnouncement } from "./types";

export function filterUniverse(
  data: CorporateAnnouncement[]
){

  return data.filter(item =>
    STOCK_UNIVERSE.includes(item.symbol)
  );

}

