"use client";

import { useEffect } from "react";
import { selectIsAuthenticated } from "@/features/auth/store/selectors";
import { fetchCart, loadGuestCart } from "@/features/cart/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartBootstrap() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      dispatch(loadGuestCart());
    }
  }, [dispatch, isAuthenticated]);

  return null;
}
