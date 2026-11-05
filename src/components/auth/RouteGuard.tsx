"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  selectAuthLoading,
  selectUser,
} from "@/features/auth/store/selectors";
import { isAdminRole } from "@/lib/auth";
import { useAppSelector } from "@/store/hooks";

type RouteGuardProps = {
  children: React.ReactNode;
  loginPath?: string;
  requireAdmin?: boolean;
};

export function RouteGuard({
  children,
  loginPath = "/login",
  requireAdmin = false,
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      const from = encodeURIComponent(pathname);
      router.replace(`${loginPath}?from=${from}`);
      return;
    }

    if (requireAdmin && !isAdminRole(user.role)) {
      router.replace("/admin/login");
    }
  }, [isLoading, user, router, pathname, loginPath, requireAdmin]);

  if (isLoading) {
    return <p className="font-lora text-warm-gray">Loading…</p>;
  }

  if (!user || (requireAdmin && !isAdminRole(user.role))) {
    return null;
  }

  return <>{children}</>;
}
