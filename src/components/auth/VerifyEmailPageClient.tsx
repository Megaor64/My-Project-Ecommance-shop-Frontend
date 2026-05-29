"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailStep } from "@/components/auth/VerifyEmailStep";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resendVerification } from "@/features/auth/store/thunks";
import { verifyEmailPath } from "@/lib/auth-errors";
import { useAppDispatch } from "@/store/hooks";

export function VerifyEmailPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const emailFromQuery = searchParams.get("email")?.trim() ?? "";
  const shouldResendOnLoad = searchParams.get("resend") === "1";
  const resendStarted = useRef(false);

  const [email, setEmail] = useState(emailFromQuery);
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const sendVerificationCode = useCallback(
    async (targetEmail: string) => {
      setIsSendingCode(true);
      try {
        await dispatch(resendVerification({ email: targetEmail })).unwrap();
        toast.success("Verification code sent to your email.");
      } catch (err) {
        const message =
          typeof err === "string" ? err : "Could not send verification code";
        // Old API deployments may not have POST /auth/resend-verification yet.
        if (message === "Not found") {
          toast.message(
            "Use the code from your registration email, or click Resend code after the server is updated."
          );
          return;
        }
        toast.error(message);
      } finally {
        setIsSendingCode(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!emailFromQuery || !shouldResendOnLoad || resendStarted.current) {
      return;
    }
    resendStarted.current = true;
    void sendVerificationCode(emailFromQuery);
  }, [emailFromQuery, shouldResendOnLoad, sendVerificationCode]);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email address.");
      return;
    }
    router.replace(verifyEmailPath(trimmed, false));
    await sendVerificationCode(trimmed);
  }

  if (!emailFromQuery) {
    return (
      <AuthShell
        title="Verify your email"
        subtitle="Enter your email and we will send you a new verification code."
      >
        <form onSubmit={handleRequestCode}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="verify-email">Email</FieldLabel>
              <Input
                id="verify-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              className="w-full rounded-md"
              disabled={isSendingCode}
            >
              {isSendingCode ? "Sending code…" : "Send verification code"}
            </Button>
          </FieldGroup>
        </form>
        <p className="mt-6 text-center font-lora text-sm text-warm-gray">
          <Link href="/login" className="text-gold hover:underline">
            Back to sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the code we sent to complete verification."
    >
      <VerifyEmailStep
        email={emailFromQuery}
        onVerified={() => router.push("/login")}
      />
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        <Link href="/login" className="text-gold hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
