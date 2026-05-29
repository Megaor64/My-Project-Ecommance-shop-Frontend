"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resendVerification, verifyEmail } from "@/features/auth/store/thunks";
import { useAppDispatch } from "@/store/hooks";

type VerifyEmailStepProps = {
  email: string;
  onVerified: () => void;
};

export function VerifyEmailStep({
  email,
  onVerified,
}: VerifyEmailStepProps) {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleResend() {
    setIsResending(true);
    try {
      await dispatch(resendVerification({ email })).unwrap();
      toast.success("A new verification code was sent to your email.");
    } catch (err) {
      const message =
        typeof err === "string" ? err : "Could not send verification code";
      if (message === "Not found") {
        toast.error(
          "Resend is not available on the server yet. Redeploy the backend, or use the code from your registration email."
        );
      } else {
        toast.error(message);
      }
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(verifyEmail({ email, code })).unwrap();
      toast.success("Email verified. You can sign in now.");
      onVerified();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>Verification code</FieldLabel>
          <FieldDescription>
            We sent a 6-digit code to {email}.
          </FieldDescription>
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </Field>
        <Button type="submit" className="w-full rounded-md" disabled={isSubmitting}>
          {isSubmitting ? "Verifying…" : "Verify email"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-md"
          disabled={isResending || isSubmitting}
          onClick={() => void handleResend()}
        >
          {isResending ? "Sending code…" : "Resend code"}
        </Button>
      </FieldGroup>
    </form>
  );
}
