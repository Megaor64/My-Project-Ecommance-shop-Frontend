"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DynamicSearchBar } from "@/components/home/DynamicSearchBar";
import { useSearch } from "@/components/providers/SearchProvider";
import { isSearchablePath } from "@/lib/searchUrl";

export function StoreSearchChrome() {
  const pathname = usePathname();
  const { setSearchOpen, clearSearch } = useSearch();
  const searchable = isSearchablePath(pathname);

  // Leaving a searchable page: close the bar and drop the active filters so
  // it does not pop up unexpectedly when the user comes back.
  useEffect(() => {
    if (!searchable) {
      setSearchOpen(false);
      clearSearch();
    }
  }, [searchable, setSearchOpen, clearSearch]);

  if (!searchable) {
    return null;
  }

  return <DynamicSearchBar />;
}
