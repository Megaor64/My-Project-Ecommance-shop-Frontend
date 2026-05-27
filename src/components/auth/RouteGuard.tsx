"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  selectAuthLoading,
  selectUser,
} from "@/features/auth/store/selectors";
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

    if (requireAdmin && user.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [isLoading, user, router, pathname, loginPath, requireAdmin]);

  if (isLoading) {
    return <p className="font-lora text-warm-gray">Loading…</p>;
  }

  if (!user || (requireAdmin && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
