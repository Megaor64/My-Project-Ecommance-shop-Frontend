"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { initialAuthState } from "@/features/auth/store/slice";
import { getAuthToken } from "@/lib/auth-storage";
import type { RootState } from "@/store";
import { makeStore } from "@/store";
import { setupHttpClientAuth } from "@/store/listenerMiddleware";

function buildPreloadedState(): Partial<RootState> {
  const token = getAuthToken();

  return {
    auth: {
      ...initialAuthState,
      token,
      status: token ? "loading" : "idle",
    },
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore(buildPreloadedState());
    setupHttpClientAuth(storeRef.current.getState, storeRef.current.dispatch);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
