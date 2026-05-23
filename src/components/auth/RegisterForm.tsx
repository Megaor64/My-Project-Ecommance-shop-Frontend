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
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        register({ name, email, password })
      ).unwrap();
      toast.success("Check your email for a verification code.");
      setEmail(result.email);
      setStep("verify");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "verify") {
    return (
      <AuthShell
        title="Verify your email"
        subtitle="Enter the code we sent to complete registration."
      >
        <VerifyEmailStep
          email={email}
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

  async function handleGoogleSuccess() {
    await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
    toast.success("Account ready. Welcome to Folio.");
    router.push("/");
  }

  return (
    <AuthShell title="Create account" subtitle="Join Folio and discover your next read.">
      <GoogleSignInButton
        intent="customer"
        disabled={isSubmitting}
        onSuccess={handleGoogleSuccess}
      />
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
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
            <FieldLabel htmlFor="password">Password</FieldLabel>
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
            <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
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
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </FieldGroup>
      </form>
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
      <AdminPortalLinks
        showAdminLogin
        showAdminRegister={showAdminRegister}
      />
    </AuthShell>
  );
}
