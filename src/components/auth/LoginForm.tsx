"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/features/auth/store/thunks";
import { syncGuestCart } from "@/features/cart/store/thunks";
import {
  isUnverifiedUserError,
  verifyEmailPath,
} from "@/lib/auth-errors";
import { AdminPortalLinks } from "@/components/auth/AdminPortalLinks";
import { DemoLoginButton } from "@/components/auth/DemoLoginButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

type LoginFormProps = {
  showAdminLogin?: boolean;
};

function getPostLoginPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }
  return from;
}

export function LoginForm({ showAdminLogin = true }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await dispatch(
        login({ email, password, remember })
      ).unwrap();
      if (!result.user) {
        throw new Error(t("auth.loginFailed"));
      }
      await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
      toast.success(t("auth.welcomeBack"));
      router.push(getPostLoginPath(searchParams.get("from")));
    } catch (err) {
      const message = typeof err === "string" ? err : t("auth.loginFailed");
      if (isUnverifiedUserError(message) && email.trim()) {
        toast.error(
          <span className="font-lora">
            {t("auth.unverifiedUser")}{" "}
            <Link
              href={verifyEmailPath(email.trim())}
              className="font-semibold text-gold underline underline-offset-4 hover:opacity-90"
            >
              {t("auth.verifyYourEmailLink")}
            </Link>
          </span>
        );
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSuccess() {
    await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
    toast.success(t("auth.welcomeBack"));
    router.push(getPostLoginPath(searchParams.get("from")));
  }

  return (
    <AuthShell
      title={t("auth.signIn")}
      subtitle={t("auth.signInSubtitle")}
    >
      <GoogleSignInButton
        intent="customer"
        remember={remember}
        disabled={isSubmitting}
        onSuccess={handleGoogleSuccess}
      />
      <form onSubmit={handleSubmit}>
        <FieldGroup>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(v) => setRemember(v === true)}
            />
            <Label htmlFor="remember" className="font-lora text-sm font-normal">
              {t("auth.rememberMe")}
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
          </Button>
        </FieldGroup>
      </form>
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        {t("auth.newHere")}{" "}
        <Link href="/register" className="text-gold underline-offset-4 hover:underline">
          {t("auth.createAccountLink")}
        </Link>
      </p>
      <DemoLoginButton />
      <AdminPortalLinks showAdminLogin={showAdminLogin} />
    </AuthShell>
  );
}
