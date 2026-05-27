"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import httpClient from "@/lib/httpClient";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { selectUser } from "@/features/auth/store/selectors";
import { logout } from "@/features/auth/store/thunks";
import { deleteAccount } from "@/features/settings/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function SecurityForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!password) {
      toast.message("הזן סיסמה חדשה");
      return;
    }
    if (password.length < 8) {
      toast.error("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    setIsSaving(true);
    try {
      await httpClient.patch(`/users/${user.id}`, { password });
      setPassword("");
      setConfirmPassword("");
      toast.success("הסיסמה עודכנה");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "עדכון נכשל");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (
      !confirm(
        "למחוק את החשבון לצמיתות? פעולה זו אינה ניתנת לביטול."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteAccount(user.id)).unwrap();
      await dispatch(logout()).unwrap();
      router.replace("/");
      toast.success("החשבון נמחק");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "מחיקת החשבון נכשלה");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={(e) => void handlePasswordSubmit(e)}>
        <h2 className="font-playfair text-lg text-ink">שינוי סיסמה</h2>
        <FieldGroup className="mt-4">
          <Field>
            <FieldLabel htmlFor="new-password">סיסמה חדשה</FieldLabel>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-lora"
              minLength={8}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">אימות סיסמה</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-lora"
            />
          </Field>
          <Button type="submit" className="rounded-md" disabled={isSaving}>
            {isSaving ? "שומר…" : "עדכן סיסמה"}
          </Button>
        </FieldGroup>
      </form>

      <section className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
        <h2 className="font-playfair text-lg text-destructive">מחיקת חשבון</h2>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          כל הנתונים וההגדרות יימחקו לצמיתות.
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4 rounded-md"
          disabled={isDeleting}
          onClick={() => void handleDeleteAccount()}
        >
          {isDeleting ? "מוחק…" : "מחק חשבון"}
        </Button>
      </section>
    </div>
  );
}
