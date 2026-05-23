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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export function AdminRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (adminPass.length < 8) {
      toast.error("Admin secret must be at least 8 characters.");
      return;
    }
    if (!adminPass) {
      toast.error("Admin secret is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, adminPass }),
      });
      const data = (await res.json()) as {
        message?: string;
        email?: string;
      };
      if (!res.ok) {
        throw new Error(data.message ?? "Registration failed");
      }
      toast.success("Check your email for a verification code.");
      setEmail(data.email ?? email);
      setStep("verify");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "verify") {
    return (
      <AuthShell
        variant="admin"
        title="Verify staff email"
        subtitle="Enter the code we sent to complete registration."
      >
        <VerifyEmailStep
          email={email}
          onVerified={() => router.push("/admin/login")}
        />
        <p className="mt-6 text-center font-lora text-sm text-warm-gray">
          <Link href="/admin/login" className="text-gold hover:underline">
            Back to staff sign in
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      variant="admin"
      title="Register staff"
      subtitle="Create an admin account with the shared secret."
    >
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="admin-name">Name</FieldLabel>
            <Input
              id="admin-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="admin-reg-email">Email</FieldLabel>
            <Input
              id="admin-reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="admin-secret">Admin secret</FieldLabel>
            <Input
              id="admin-secret"
              type="password"
              required
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
            />
            <FieldDescription>
              Staff registration secret required by your administrator.
            </FieldDescription>
          </Field>
          <GoogleSignInButton
            intent="admin-register"
            adminPass={adminPass}
            showDivider={false}
            disabled={isSubmitting || adminPass.length < 8}
            onSuccess={async () => {
              toast.success("Staff account created. You can sign in now.");
              router.push("/admin/login");
            }}
          />
          <Button
            type="submit"
            className="w-full rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering…" : "Register staff account"}
          </Button>
        </FieldGroup>
      </form>
      <p className="mt-6 text-center font-lora text-sm text-warm-gray">
        <Link href="/admin/login" className="text-gold hover:underline">
          Staff sign in
        </Link>
      </p>
    </AuthShell>
  );
}
