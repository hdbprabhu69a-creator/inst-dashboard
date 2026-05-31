import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const request_token =
      searchParams.get("request_token");

    if (!request_token) {
      return NextResponse.json({
        success: false,
        error: "No request token received",
      });
    }

    console.log(
      "REQUEST TOKEN:",
      request_token
    );

    const checksum = crypto
      .createHash("sha256")
      .update(
        process.env.KITE_API_KEY! +
        request_token +
        process.env.KITE_API_SECRET!
      )
      .digest("hex");

    console.log(
      "GENERATING ACCESS TOKEN..."
    );

    const response = await axios.post(
      "https://api.kite.trade/session/token",
      new URLSearchParams({
        api_key: process.env.KITE_API_KEY!,
        request_token,
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

    const accessToken =
      response.data.data.access_token;

    console.log(
      "ACCESS TOKEN RECEIVED"
    );

    await setDoc(
      doc(db, "settings", "kite"),
      {
        accessToken,
        updatedAt:
          new Date().toISOString(),
      }
    );

    console.log(
      "FIRESTORE UPDATED SUCCESSFULLY"
    );

    // Redirect back to dashboard
    return NextResponse.redirect(
      new URL("/", req.url)
    );

  } catch (error: any) {

    console.error(
      "TOKEN ROUTE ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    return NextResponse.json({
      success: false,
      error:
        error.response?.data ||
        error.message,
    });
  }
}