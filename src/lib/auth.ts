export type UserRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const AUTH_COOKIE_NAMES = {
  token: "auth-token",
} as const;

export function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    (u.role === "customer" || u.role === "admin")
  );
}

export function mapExpressUser(doc: Record<string, unknown>): AuthUser {
  return {
    id: String(doc._id ?? doc.id),
    name: String(doc.name ?? ""),
    email: String(doc.email ?? ""),
    role: (doc.role === "admin" ? "admin" : "customer") as UserRole,
  };
}
