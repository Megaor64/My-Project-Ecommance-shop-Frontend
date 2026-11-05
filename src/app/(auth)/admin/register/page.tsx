"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminRegisterForm } from "@/components/auth/AdminRegisterForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";
import { useT } from "@/lib/i18n";

export default function AdminRegisterPage() {
  const router = useRouter();
  const t = useT();
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    void fetchAuthPublicConfig().then((config) => {
      if (!config.adminRegisterEnabled) {
        router.replace("/login");
        return;
      }
      setEnabled(true);
    });
  }, [router]);

  if (!enabled) {
    return <p className="font-lora text-warm-gray">{t("common.loading")}</p>;
  }

  return <AdminRegisterForm />;
}
