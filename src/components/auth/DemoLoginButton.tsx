"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/features/auth/store/thunks";
import { useAppDispatch } from "@/store/hooks";

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
// Set only on the real site: the URL of the demo site (no trailing slash needed).
const DEMO_SITE_URL = (process.env.NEXT_PUBLIC_DEMO_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export function DemoLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!IS_DEMO_MODE) {
    // Real site: just a link to the demo site's admin login page.
    if (!DEMO_SITE_URL) return null;
    return (
      <Button asChild variant="outline" className="mt-4 w-full rounded-md">
        <a
          href={`${DEMO_SITE_URL}/admin/login/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Try Admin Demo
        </a>
      </Button>
    );
  }

  async function handleClick() {
    setIsSubmitting(true);
    try {
      await dispatch(demoLogin()).unwrap();
      toast.success("Signed in to the read-only admin demo.");
      router.push("/admin/inquiries");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Demo login failed");
      setIsSubmitting(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="mt-4 w-full rounded-md"
      disabled={isSubmitting}
      onClick={() => void handleClick()}
    >
      {isSubmitting ? "Opening demo…" : "Try Admin Demo"}
    </Button>
  );
}
