import "server-only";
import { expressFetch, getVerifiedSession } from "@/lib/auth-server";
import type { UserSettings } from "@/features/settings/types";

export async function fetchSettingsServer(
  userId: string
): Promise<UserSettings | null> {
  const session = await getVerifiedSession();
  if (!session) return null;

  if (
    String(session.payload.userId) !== String(userId) &&
    session.payload.role !== "admin"
  ) {
    return null;
  }

  const res = await expressFetch(
    `/users/${userId}/settings`,
    { method: "GET" },
    session.token
  );

  if (!res.ok) return null;

  const json = (await res.json()) as { data?: UserSettings };
  return json.data ?? null;
}
