"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

type AdminPortalLinksProps = {
  showAdminLogin?: boolean;
  showAdminRegister?: boolean;
};

export function AdminPortalLinks({
  showAdminLogin = true,
  showAdminRegister = false,
}: AdminPortalLinksProps) {
  const t = useT();
  if (!showAdminLogin && !showAdminRegister) return null;

  return (
    <div className="mt-6 space-y-3 border-t border-warm-gray/20 pt-6">
      <p className="text-center font-lora text-xs uppercase tracking-wide text-warm-gray">
        {t("auth.staffAccess")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        {showAdminLogin ? (
          <Button
            asChild
            variant="outline"
            className="rounded-md border-burgundy text-burgundy hover:bg-burgundy hover:text-cream"
          >
            <Link href="/admin/login">{t("auth.adminLogin")}</Link>
          </Button>
        ) : null}
        {showAdminRegister ? (
          <Button
            asChild
            variant="outline"
            className="rounded-md border-burgundy text-burgundy hover:bg-burgundy hover:text-cream"
          >
            <Link href="/admin/register">{t("auth.adminRegister")}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
