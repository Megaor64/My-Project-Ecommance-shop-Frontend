"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { AdminPortalLinks } from "@/components/auth/AdminPortalLinks";
import { DemoLoginButton } from "@/components/auth/DemoLoginButton";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { adminLogin, adminVerify2fa } from "@/features/auth/store/thunks";
import { syncGuestCart } from "@/features/cart/store/thunks";
import { useAppDispatch } from "@/store/hooks";

type AdminLoginFormProps = {
  showAdminRegister?: boolean;
};

export function AdminLoginForm({
  showAdminRegister = false,
}: AdminLoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(adminLogin({ email, password })).unwrap();
      toast.success("Verification code sent to your email.");
      setStep("otp");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code from your email.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        adminVerify2fa({ email, code, remember })
      ).unwrap();
      await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
      toast.success("Welcome, staff.");
      router.push("/admin/inquiries");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      variant="admin"
      title={step === "credentials" ? "Staff sign in" : "Enter verification code"}
      subtitle={
        step === "credentials"
          ? "Step 1 of 2 — your admin credentials"
          : `Step 2 of 2 — code sent to ${email}`
      }
    >
      {step === "credentials" ? (
        <>
          <GoogleSignInButton
            intent="admin-login"
            remember={remember}
            disabled={isSubmitting}
            onSuccess={async () => {
              await dispatch(syncGuestCart()).unwrap().catch(() => undefined);
              toast.success("Welcome, staff.");
              router.push("/admin/inquiries");
            }}
          />
          <form onSubmit={handleCredentials}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <Input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <Input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              className="w-full rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending code…" : "Continue"}
            </Button>
          </FieldGroup>
        </form>
        </>
      ) : (
        <form onSubmit={handleOtp}>
          <FieldGroup>
            <Field>
              <FieldLabel>One-time code</FieldLabel>
              <FieldDescription>Enter the 6-digit code from your inbox.</FieldDescription>
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="admin-remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(v === true)}
              />
              <Label htmlFor="admin-remember" className="font-lora text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-md"
              onClick={() => setStep("credentials")}
            >
              Back
            </Button>
          </FieldGroup>
        </form>
      )}
      <DemoLoginButton />
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        <Link href="/login" className="text-gold hover:underline">
          Customer sign in
        </Link>
      </p>
      {showAdminRegister ? (
        <AdminPortalLinks showAdminLogin={false} showAdminRegister />
      ) : null}
    </AuthShell>
  );
}
