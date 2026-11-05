"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { register } from "@/features/auth/store/thunks";
import { useT } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";
import { AdminPortalLinks } from "@/components/auth/AdminPortalLinks";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { syncGuestCart } from "@/features/cart/store/thunks";

type RegisterFormProps = {
  showAdminRegister?: boolean;
};

export function RegisterForm({ showAdminRegister = false }: RegisterFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useT();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("auth.passwordsMismatch"));
      return;
    }
    if (password.length < 8) {
      toast.error(t("auth.passwordTooShort"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        register({ name, email, password })
      ).unwrap();
      toast.success(t("auth.checkEmailForCode"));
      setEmail(result.email);
      setStep("verify");
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("auth.registrationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "verify") {
    return (
      <AuthShell
        title={t("verify.title")}
        subtitle={t("verify.subtitleRegister")}
      >
        <VerifyEmailStep
          email={email}
          onVerified={() => router.push("/login")}
        />
        <p className="mt-6 text-center font-lora text-sm text-warm-gray">
          <Link href="/login" className="text-gold hover:underline">
            {t("auth.backToSignIn")}
          </Link>
        </p>
      </AuthShell>
    );
  }

  async function handleGoogleSuccess() {
    await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
    toast.success(t("auth.accountReady"));
    router.push("/");
  }

  return (
    <AuthShell
      title={t("auth.createAccount")}
      subtitle={t("auth.createAccountSubtitle")}
    >
      <GoogleSignInButton
        intent="customer"
        disabled={isSubmitting}
        onSuccess={handleGoogleSuccess}
      />
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">{t("common.name")}</FieldLabel>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">{t("common.email")}</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t("common.password")}</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm">{t("common.confirmPassword")}</FieldLabel>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.creatingAccount") : t("auth.createAccount")}
          </Button>
        </FieldGroup>
      </form>
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-gold hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>
      <AdminPortalLinks
        showAdminLogin
        showAdminRegister={showAdminRegister}
      />
    </AuthShell>
  );
}
