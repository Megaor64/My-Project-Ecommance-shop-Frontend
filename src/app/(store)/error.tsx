"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h2 className="font-playfair text-2xl font-semibold text-ink">
        {t("error.title")}
      </h2>
      <p className="mt-3 font-lora text-sm text-warm-gray">
        {t("error.body")}
      </p>
      <Button type="button" className="mt-6 rounded-md" onClick={reset}>
        {t("common.tryAgain")}
      </Button>
    </div>
  );
}
