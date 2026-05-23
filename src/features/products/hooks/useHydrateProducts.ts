"use client";

import { useEffect, useRef } from "react";
import type { Book } from "@/features/products/types";
import { hydrateBooks } from "@/features/products/store/slice";
import { useAppDispatch } from "@/store/hooks";

export function useHydrateProducts(initialBooks: Book[]) {
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current && initialBooks.length > 0) {
      dispatch(hydrateBooks(initialBooks));
      hydrated.current = true;
    }
  }, [dispatch, initialBooks]);
}
