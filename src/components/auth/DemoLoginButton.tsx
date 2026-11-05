"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { demoLogin } from "@/features/auth/store/thunks";
import { useAppDispatch } from "@/store/hooks";

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export function DemoLoginButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!IS_DEMO_MODE) return null;

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
