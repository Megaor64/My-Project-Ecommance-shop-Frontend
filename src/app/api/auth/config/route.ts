import { NextResponse } from "next/server";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export async function GET() {
  const config = await fetchAuthPublicConfig();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
