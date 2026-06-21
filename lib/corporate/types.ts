export interface CorporateAnnouncement {
  date: string;
  time: string;
  stock: string;
  type: string;
  summary: string;
  source: "NSE" | "BSE";
  attachment?: string;
}