"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailStep } from "@/components/auth/VerifyEmailStep";
import { adminRegister } from "@/features/auth/services/authService";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useT } from "@/lib/i18n";

export function AdminRegisterForm() {
  const router = useRouter();
  const t = useT();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (adminPass.length < 8) {
      toast.error(t("staff.secretTooShort"));
      return;
    }
    if (!adminPass) {
      toast.error(t("staff.secretRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await adminRegister({ name, email, adminPass });
      toast.success(t("auth.checkEmailForCode"));
      setEmail(data.email ?? email);
      setStep("verify");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.registrationFailed"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "verify") {
    return (
      <AuthShell
        variant="admin"
        title={t("staff.verifyTitle")}
        subtitle={t("verify.subtitleRegister")}
      >
        <VerifyEmailStep
          email={email}
          onVerified={() => router.push("/admin/login")}
        />
        <p className="mt-6 text-center font-lora text-sm text-warm-gray">
          <Link href="/admin/login" className="text-gold hover:underline">
            {t("staff.backToSignIn")}
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      variant="admin"
      title={t("staff.registerTitle")}
      subtitle={t("staff.registerSubtitle")}
    >
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="admin-name">{t("common.name")}</FieldLabel>
            <Input
              id="admin-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="admin-reg-email">{t("common.email")}</FieldLabel>
            <Input
              id="admin-reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="admin-secret">{t("staff.adminSecret")}</FieldLabel>
            <Input
              id="admin-secret"
              type="password"
              required
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
            />
            <FieldDescription>
              {t("staff.adminSecretHint")}
            </FieldDescription>
          </Field>
          <GoogleSignInButton
            intent="admin-register"
            adminPass={adminPass}
            showDivider={false}
            disabled={isSubmitting || adminPass.length < 8}
            onSuccess={async () => {
              toast.success(t("staff.accountCreated"));
              router.push("/admin/login");
            }}
          />
          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("staff.registering") : t("staff.registerSubmit")}
          </Button>
        </FieldGroup>
      </form>
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        <Link href="/admin/login" className="text-gold hover:underline">
          {t("staff.signInLink")}
        </Link>
      </p>
    </AuthShell>
  );
}
