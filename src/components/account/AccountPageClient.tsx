"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "@/components/sidebar/AccountSidebar";
import { selectAuthLoading, selectUser } from "@/features/auth/store/selectors";
import { useT } from "@/lib/i18n";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";

export function AccountPageClient() {
  const router = useRouter();
  const t = useT();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="font-lora text-warm-gray">{t("account.loading")}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold">
          {t("account.welcomeBack")}
        </p>
        <h1 className="mt-3 font-playfair text-3xl font-semibold text-ink md:text-4xl">
          {user.name}
        </h1>
        <p className="mt-3 font-lora text-warm-gray">
          {t("account.intro")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            className="rounded-md"
            onClick={() => setSidebarOpen(true)}
          >
            {t("account.quickPanel")}
          </Button>
          <Button type="button" variant="outline" className="rounded-md font-lora" asChild>
            <a href="/account/settings/appearance">{t("account.settings")}</a>
          </Button>
        </div>
      </div>
      <AccountSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </>
  );
}
