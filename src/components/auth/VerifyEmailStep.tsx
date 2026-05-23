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
import { verifyEmail } from "@/features/auth/store/thunks";
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
      </FieldGroup>
    </form>
  );
}
