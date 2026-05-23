"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import type { AuthUser } from "@/lib/auth";
import { initialAuthState } from "@/features/auth/store/slice";
import type { RootState } from "@/store";
import { makeStore } from "@/store";
import { setupHttpClientAuth } from "@/store/listenerMiddleware";

function buildPreloadedState(initialUser: AuthUser | null): Partial<RootState> {
  return {
    auth: {
      ...initialAuthState,
      user: initialUser,
      status: initialUser ? "succeeded" : "loading",
    },
  };
}

export function StoreProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState(initialUser));
    setupHttpClientAuth(
      storeRef.current.getState,
      storeRef.current.dispatch
    );
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
