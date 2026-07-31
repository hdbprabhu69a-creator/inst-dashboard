import { CorporateAnnouncement } from "./types";

let corporateCache: CorporateAnnouncement[] = [];

export function getCache() {
  return corporateCache;
}

export function setCache(
  data: CorporateAnnouncement[]
) {
  corporateCache = data;
}
