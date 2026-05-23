"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useSearch } from "@/components/providers/SearchProvider";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { buildSearchUrl, getSearchPage } from "@/lib/searchUrl";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 0.75;

export function DynamicSearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    query,
    maxPrice,
    setQuery,
    setMaxPrice,
    clearSearch,
    isSearchOpen,
    setSearchOpen,
  } = useSearch();
  const [visibleByScroll, setVisibleByScroll] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isSearchOpen) {
      setDismissed(false);
    }
  }, [isSearchOpen]);

  function handleClose() {
    setSearchOpen(false);
    setDismissed(true);
  }

  function handleSearch() {
    const page = getSearchPage(pathname);
    const url = buildSearchUrl(page, query, maxPrice);
    if (pathname === page) {
      router.replace(url);
    } else {
      router.push(url);
    }
    setSearchOpen(true);
  }

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * SCROLL_THRESHOLD;
      setVisibleByScroll(window.scrollY >= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = (visibleByScroll || isSearchOpen) && !dismissed;

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-[7.25rem] z-30 border-b border-border bg-parchment/98 px-4 py-3 shadow-sm backdrop-blur-md transition-all duration-300 xl:top-[4.5rem]",
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      )}
      role="search"
      aria-label="Book search"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          type="search"
          placeholder="Search by title or author…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="min-w-0 flex-1 rounded-md border-ink/15 bg-cream font-lora normal-case tracking-normal sm:min-w-[12rem]"
          aria-label="Search books"
        />
        <div className="flex min-w-0 flex-1 basis-full items-center gap-3 sm:min-w-[10rem] sm:basis-auto">
          <span className="shrink-0 font-lora text-xs text-warm-gray">
            Max ${maxPrice > 0 ? maxPrice : "any"}
          </span>
          <Slider
            min={0}
            max={50}
            step={5}
            value={[maxPrice]}
            onValueChange={([v]) => setMaxPrice(v ?? 0)}
            className="min-w-0 flex-1"
            aria-label="Maximum price"
          />
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            className="rounded-md font-lora normal-case tracking-normal"
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="font-lora normal-case tracking-normal"
            onClick={clearSearch}
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close search"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
