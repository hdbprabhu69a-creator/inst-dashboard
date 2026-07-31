import { NextResponse } from "next/server";
import { getUniverse } from "@/institutional-analysis/repository/universeRepository";

export async function GET() {

  const universe = await getUniverse();

  return NextResponse.json({

    success:true,

    total: universe.length,

    stocks: universe.slice(0,20)

  });

}

