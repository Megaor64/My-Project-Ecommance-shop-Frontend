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
import { useT } from "@/lib/i18n";
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
  const t = useT();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleResend() {
    setIsResending(true);
    try {
      await dispatch(resendVerification({ email })).unwrap();
      toast.success(t("verify.resent"));
    } catch (err) {
      const message =
        typeof err === "string" ? err : t("verify.sendFailed");
      if (message === "Not found") {
        toast.error(t("verify.resendUnavailable"));
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
      toast.error(t("verify.enterCode"));
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(verifyEmail({ email, code })).unwrap();
      toast.success(t("verify.success"));
      onVerified();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("verify.failed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel>{t("verify.codeLabel")}</FieldLabel>
          <FieldDescription>
            {t("verify.codeSent", { email })}
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
          {isSubmitting ? t("verify.verifying") : t("verify.submit")}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-md"
          disabled={isResending || isSubmitting}
          onClick={() => void handleResend()}
        >
          {isResending ? t("verify.sendingCode") : t("verify.resend")}
        </Button>
      </FieldGroup>
    </form>
  );
}
