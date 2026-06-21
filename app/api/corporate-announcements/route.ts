import { NextResponse } from "next/server";
import { getCorporateAnnouncements } from "@/lib/corporate/source";

export async function GET() {
  const data =
    await getCorporateAnnouncements();

  return NextResponse.json(data);
}