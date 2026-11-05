"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import { toast } from "sonner";
import { isGoogleAuthConfigured } from "@/components/auth/AuthGoogleProvider";
import type { AuthLoginResponse } from "@/features/auth/types";
import { googleAuth } from "@/features/auth/store/thunks";
import type { GoogleAuthIntent } from "@/features/auth/services/authService";
import { useT } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";

type GoogleSignInButtonProps = {
  intent: GoogleAuthIntent;
  adminPass?: string;
  remember?: boolean;
  disabled?: boolean;
  showDivider?: boolean;
  onSuccess?: (result: AuthLoginResponse) => void | Promise<void>;
};

function AuthDivider() {
  const t = useT();
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-cream px-3 font-lora text-xs uppercase tracking-wide text-warm-gray">
          {t("auth.orContinueWithEmail")}
        </span>
      </div>
    </div>
  );
}

export function GoogleSignInButton({
  intent,
  adminPass,
  remember = false,
  disabled = false,
  showDivider = true,
  onSuccess,
}: GoogleSignInButtonProps) {
  const dispatch = useAppDispatch();
  const t = useT();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isGoogleAuthConfigured()) {
    return null;
  }

  async function handleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error(t("auth.googleFailed"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        googleAuth({
          idToken,
          intent,
          remember,
          ...(adminPass !== undefined ? { adminPass } : {}),
        })
      ).unwrap();
      await onSuccess?.(result);
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("auth.googleFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-0">
      <div
        className={
          disabled || isSubmitting ? "pointer-events-none opacity-50" : undefined
        }
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            toast.error(t("auth.googleCancelled"));
          }}
          useOneTap={false}
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
      </div>
      {showDivider ? <AuthDivider /> : null}
    </div>
  );
}
