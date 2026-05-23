import httpClient from "@/lib/httpClient";
import type {
  AppearanceSettings,
  NotificationSettings,
  PermissionSettings,
  UserSettings,
} from "@/features/settings/types";
import type { AdminUser } from "@/features/settings/types";

function normalizeSettings(payload: unknown): UserSettings {
  if (payload && typeof payload === "object" && "settings" in payload) {
    return (payload as { settings: UserSettings }).settings;
  }
  return payload as UserSettings;
}

export async function fetchSettings(userId: string): Promise<UserSettings> {
  const { data } = await httpClient.get<unknown>(`/users/${userId}/settings`);
  return normalizeSettings(data);
}

export async function updateAppearance(
  userId: string,
  appearance: AppearanceSettings
): Promise<UserSettings> {
  const { data } = await httpClient.patch<unknown>(
    `/users/${userId}/settings/appearance`,
    appearance
  );
  return normalizeSettings(data);
}

export async function updateNotifications(
  userId: string,
  notifications: NotificationSettings
): Promise<UserSettings> {
  const { data } = await httpClient.patch<unknown>(
    `/users/${userId}/settings/notifications`,
    notifications
  );
  return normalizeSettings(data);
}

export async function updatePermissions(
  userId: string,
  permissions: Partial<PermissionSettings>
): Promise<UserSettings> {
  const { data } = await httpClient.patch<unknown>(
    `/users/${userId}/settings/permissions`,
    permissions
  );
  return normalizeSettings(data);
}

export async function updateUserRole(
  userId: string,
  role: "customer" | "admin"
): Promise<{ user: AdminUser; settings: UserSettings }> {
  const { data } = await httpClient.patch<unknown>(`/users/${userId}/role`, {
    role,
  });
  const payload = data as { user?: AdminUser; settings?: UserSettings };
  if (!payload?.user || !payload?.settings) {
    throw new Error("Invalid role update response");
  }
  return { user: payload.user, settings: payload.settings };
}

export async function deleteAccount(userId: string): Promise<void> {
  await httpClient.delete(`/users/${userId}`);
}

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const { data } = await httpClient.get<AdminUser[]>("/users");
  return Array.isArray(data) ? data : [];
}
