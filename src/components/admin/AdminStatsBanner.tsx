"use client";

import { useEffect, useState } from "react";

export function AdminStatsBanner() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stats/admin");
        if (!res.ok) return;
        const data = (await res.json()) as { userCount?: number };
        if (!cancelled && typeof data.userCount === "number") {
          setUserCount(data.userCount);
        }
      } catch {
        /* banner is supplementary */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (userCount === null) return null;

  return (
    <p className="font-lora text-xs opacity-90">
      Registered customers: <span className="font-semibold">{userCount}</span>
    </p>
  );
}
