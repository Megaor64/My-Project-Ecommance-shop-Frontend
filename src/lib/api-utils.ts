import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function validationErrorResponse(error: ZodError): NextResponse {
  const message = error.issues.map((i) => i.message).join(", ");
  return NextResponse.json({ message }, { status: 400 });
}

import { fetchAuthPublicConfig } from "@/lib/auth-config";

export async function isAdminRegisterEnabled(): Promise<boolean> {
  const config = await fetchAuthPublicConfig();
  return config.adminRegisterEnabled;
}
