"use client";

import { usePathname } from "next/navigation";
import { DynamicSearchBar } from "@/components/home/DynamicSearchBar";

export function StoreSearchChrome() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return <DynamicSearchBar />;
}
