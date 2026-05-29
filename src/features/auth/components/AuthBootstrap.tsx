"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/auth/store/selectors";
import { fetchMe } from "@/features/auth/store/thunks";
import { getAuthToken } from "@/lib/auth-storage";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!user && getAuthToken()) {
      void dispatch(fetchMe());
    }
  }, [dispatch, user]);

  return null;
}
