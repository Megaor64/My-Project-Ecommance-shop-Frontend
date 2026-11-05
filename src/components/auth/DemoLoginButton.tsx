"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/features/auth/store/thunks";
import { useT } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
// Set only on the real site: the URL of the demo site (no trailing slash needed).
const DEMO_SITE_URL = (process.env.NEXT_PUBLIC_DEMO_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export function DemoLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoStarted = useRef(false);

  async function handleClick() {
    setIsSubmitting(true);
    try {
      await dispatch(demoLogin()).unwrap();
      toast.success(t("auth.demoSignedIn"));
      router.push("/admin/inquiries");
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("auth.demoFailed"));
      setIsSubmitting(false);
    }
  }

  // Demo site: the real site links here with ?autodemo=1 so the visitor lands
  // in the demo admin without a second click.
  useEffect(() => {
    if (!IS_DEMO_MODE || autoStarted.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("autodemo") !== "1") return;
    // Deferred so no state is set synchronously inside the effect. The cleanup
    // cancels the first run under React Strict Mode, so login fires only once.
    const timer = window.setTimeout(() => {
      autoStarted.current = true;
      void handleClick();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!IS_DEMO_MODE) {
    // Real site: just a link to the demo site's admin login page.
    if (!DEMO_SITE_URL) return null;
    return (
      <Button asChild variant="outline" className="mt-4 w-full rounded-md">
        <a
          href={`${DEMO_SITE_URL}/admin/login/?autodemo=1`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("auth.tryAdminDemo")}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="mt-4 w-full rounded-md"
      disabled={isSubmitting}
      onClick={() => void handleClick()}
    >
      {isSubmitting ? t("auth.openingDemo") : t("auth.tryAdminDemo")}
    </Button>
  );
}
