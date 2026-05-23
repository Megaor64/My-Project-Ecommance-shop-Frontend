"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h2 className="font-playfair text-2xl font-semibold text-ink">
        Something went wrong
      </h2>
      <p className="mt-3 font-lora text-sm text-warm-gray">
        We could not load this page. Please try again.
      </p>
      <Button type="button" className="mt-6 rounded-md" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
