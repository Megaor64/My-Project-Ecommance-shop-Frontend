"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Book } from "@/features/products/types";
import { filterBooks } from "@/features/products/utils/mapProductToBook";

type SearchContextValue = {
  query: string;
  maxPrice: number;
  setQuery: (query: string) => void;
  setMaxPrice: (price: number) => void;
  clearSearch: () => void;
  filter: (books: Book[]) => Book[];
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const clearSearch = useCallback(() => {
    setQuery("");
    setMaxPrice(0);
  }, []);

  const filter = useCallback(
    (books: Book[]) =>
      filterBooks(books, query, maxPrice > 0 ? maxPrice : undefined),
    [query, maxPrice]
  );

  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      maxPrice,
      setQuery,
      setMaxPrice,
      clearSearch,
      filter,
      isSearchOpen,
      setSearchOpen,
    }),
    [query, maxPrice, clearSearch, filter, isSearchOpen]
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
