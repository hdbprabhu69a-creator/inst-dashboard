import { NextResponse } from "next/server";

import {
  runPendingEODIfRequired,
} from "@/lib/startup/eodRecovery";

export async function GET() {

  try {

    const result =
      await runPendingEODIfRequired();

    return NextResponse.json(result);

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
    );

  }

}