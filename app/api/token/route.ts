import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function GET(req: Request) {

  try {

    const { searchParams } = new URL(req.url);

    const request_token =
      searchParams.get("request_token");

    const checksum = crypto
      .createHash("sha256")
      .update(
        process.env.KITE_API_KEY! +
        request_token! +
        process.env.KITE_API_SECRET!
      )
      .digest("hex");

    const response = await axios.post(
      "https://api.kite.trade/session/token",
      new URLSearchParams({
        api_key: process.env.KITE_API_KEY!,
        request_token: request_token!,
        checksum,
      }),
      {
        headers: {
          "X-Kite-Version": "3",
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data);

  } catch (error: any) {

    return NextResponse.json({
      error:
        error.response?.data || error.message,
    });

  }

}