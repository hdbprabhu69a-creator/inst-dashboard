import { NextResponse } from "next/server";

export async function GET() {

  const events = [

    {
      title: "RBI Policy",
      date: "06-Aug",
      impact: "HIGH",
    },

    {
      title: "US CPI",
      date: "11-Jul",
      impact: "HIGH",
    },

    {
      title: "Fed Meeting",
      date: "30-Jul",
      impact: "HIGH",
    },

    {
      title: "India CPI",
      date: "12-Jul",
      impact: "MEDIUM",
    },

    {
      title: "GDP Data",
      date: "31-Jul",
      impact: "HIGH",
    },

    {
      title: "US Payrolls",
      date: "04-Jul",
      impact: "HIGH",
    },

  ];

  return NextResponse.json({

    success: true,

    events,

  });

}
