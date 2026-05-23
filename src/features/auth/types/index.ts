export type { AuthUser, UserRole } from "@/lib/auth";

export type AuthLoginResponse = {
  user: import("@/lib/auth").AuthUser;
  accessToken: string;
};

export type AuthRegisterResponse = {
  needsVerification: boolean;
  email: string;
  message?: string;
};

export type AuthVerifyResponse = {
  verified: boolean;
  message?: string;
};

export type AdminLoginStep1Response = {
  needsOtp: boolean;
  message?: string;
};
