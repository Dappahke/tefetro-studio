import { NextResponse } from "next/server";

export async function GET() {
  // Replace with real DB queries
  const data = {
    revenue: 1250000,
    orders: 320,
    users: 890,
    conversionRate: 4.5,
  };

  return NextResponse.json(data);
}