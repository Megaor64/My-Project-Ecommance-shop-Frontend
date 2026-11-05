"use client";

import { selectIsDemoAdmin } from "@/features/auth/store/selectors";
import { useT } from "@/lib/i18n";
import { useAppSelector } from "@/store/hooks";

export function DemoBanner() {
  const isDemoAdmin = useAppSelector(selectIsDemoAdmin);
  const t = useT();

  if (!isDemoAdmin) return null;

  return (
    <div
      role="status"
      className="bg-gold px-4 py-2 text-center font-lora text-sm font-semibold text-ink"
    >
      {t("staff.demoBanner")}
    </div>
  );
}
