"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/components/providers/SearchProvider";

export function useSyncSearchFromUrl() {
  const searchParams = useSearchParams();
  const { setQuery, setMaxPrice, setSearchOpen } = useSearch();

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const maxParam = searchParams.get("max");
    const max = maxParam ? Number(maxParam) : 0;
    setQuery(q);
    setMaxPrice(Number.isFinite(max) && max >= 0 ? max : 0);
    if (q || (maxParam != null && max > 0)) {
      setSearchOpen(true);
    }
  }, [searchParams, setQuery, setMaxPrice, setSearchOpen]);
}
