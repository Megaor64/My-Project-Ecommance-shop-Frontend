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
import { useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function SecurityForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useT();
  const user = useAppSelector(selectUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    if (!password) {
      toast.message(t("settings.security.enterPassword"));
      return;
    }
    if (password.length < 8) {
      toast.error(t("settings.security.tooShort"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("settings.security.mismatch"));
      return;
    }

    setIsSaving(true);
    try {
      await httpClient.patch(`/users/${user.id}`, { password });
      setPassword("");
      setConfirmPassword("");
      toast.success(t("settings.security.updated"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("settings.security.updateFailed")
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (!confirm(t("settings.security.deleteConfirm"))) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteAccount(user.id)).unwrap();
      await dispatch(logout()).unwrap();
      router.replace("/");
      toast.success(t("settings.security.deleted"));
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : t("settings.security.deleteFailed")
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={(e) => void handlePasswordSubmit(e)}>
        <h2 className="font-playfair text-lg text-ink">
          {t("settings.security.changePassword")}
        </h2>
        <FieldGroup className="mt-4">
          <Field>
            <FieldLabel htmlFor="new-password">
              {t("settings.security.newPassword")}
            </FieldLabel>
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
            <FieldLabel htmlFor="confirm-password">
              {t("settings.security.confirmPassword")}
            </FieldLabel>
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
            {isSaving ? t("common.saving") : t("settings.security.update")}
          </Button>
        </FieldGroup>
      </form>

      <section className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
        <h2 className="font-playfair text-lg text-destructive">
          {t("settings.security.deleteTitle")}
        </h2>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          {t("settings.security.deleteWarning")}
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4 rounded-md"
          disabled={isDeleting}
          onClick={() => void handleDeleteAccount()}
        >
          {isDeleting
            ? t("settings.security.deleting")
            : t("settings.security.deleteButton")}
        </Button>
      </section>
    </div>
  );
}
