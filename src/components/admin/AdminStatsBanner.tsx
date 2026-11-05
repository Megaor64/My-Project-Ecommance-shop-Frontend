"use client";

import { useEffect, useState } from "react";
import httpClient from "@/lib/httpClient";
import { useT } from "@/lib/i18n";

type AdminStats = {
  userCount?: number;
};

export function AdminStatsBanner() {
  const t = useT();
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await httpClient.get<AdminStats>("/stats/admin");
        if (!cancelled && typeof data?.userCount === "number") {
          setUserCount(data.userCount);
        }
      } catch {
        /* banner is supplementary */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (userCount === null) return null;

  return (
    <p className="font-lora text-xs opacity-90">
      {t("staff.registeredCustomers")} <span className="font-semibold">{userCount}</span>
    </p>
  );
}
