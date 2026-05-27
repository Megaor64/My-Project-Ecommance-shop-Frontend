import { getApiBaseUrl } from "@/lib/api";

export type AuthPublicConfig = {
  adminRegisterEnabled: boolean;
};

const DEFAULT_CONFIG: AuthPublicConfig = {
  adminRegisterEnabled: false,
};

export async function fetchAuthPublicConfig(): Promise<AuthPublicConfig> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/config`, {
      cache: "no-store",
    });
    if (!res.ok) return DEFAULT_CONFIG;

    const json = (await res.json()) as {
      data?: { adminRegisterEnabled?: boolean };
    };

    return {
      adminRegisterEnabled: json.data?.adminRegisterEnabled === true,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}
