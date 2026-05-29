export const UNVERIFIED_USER_MESSAGE =
  "The user is not verified, please verify";

export function isUnverifiedUserError(message: string): boolean {
  return message === UNVERIFIED_USER_MESSAGE;
}

export function verifyEmailPath(email: string, resend = true): string {
  const params = new URLSearchParams({ email });
  if (resend) {
    params.set("resend", "1");
  }
  return `/verify-email?${params.toString()}`;
}
