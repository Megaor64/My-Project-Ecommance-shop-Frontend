"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { selectUser } from "@/features/auth/store/selectors";
import type { AppearanceSettings } from "@/features/settings/types";
import { selectSettingsSaveStatus, selectSettings } from "@/features/settings/store/selectors";
import { updateAppearance } from "@/features/settings/store/thunks";
import { createTranslator, useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type AppearanceFormProps = {
  initialValues?: AppearanceSettings;
};

export function AppearanceForm({ initialValues }: AppearanceFormProps) {
  const dispatch = useAppDispatch();
  const t = useT();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  const saveStatus = useAppSelector(selectSettingsSaveStatus);
  const { setTheme } = useTheme();
  const resolved = initialValues ?? settings?.appearance;
  const [form, setForm] = useState<AppearanceSettings | null>(resolved ?? null);

  useEffect(() => {
    if (resolved) {
      setForm(resolved);
    }
  }, [resolved]);

  if (!form) {
    return (
      <p className="font-lora text-warm-gray">{t("settings.loadingSettings")}</p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form) return;
    try {
      await dispatch(
        updateAppearance({ userId: user.id, appearance: form })
      ).unwrap();
      setTheme(form.theme);
      // `t` still holds the previous language in this closure; announce the
      // save in the language that was just applied.
      toast.success(
        createTranslator(form.language)("settings.appearance.saved")
      );
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("settings.saveFailed"));
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>{t("settings.appearance.theme")}</FieldLabel>
          <Select
            value={form.theme}
            onValueChange={(value) =>
              setForm((prev) =>
                prev
                  ? { ...prev, theme: value as AppearanceSettings["theme"] }
                  : prev
              )
            }
          >
            <SelectTrigger className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                {t("settings.appearance.theme.light")}
              </SelectItem>
              <SelectItem value="dark">
                {t("settings.appearance.theme.dark")}
              </SelectItem>
              <SelectItem value="system">
                {t("settings.appearance.theme.system")}
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{t("settings.appearance.language")}</FieldLabel>
          <Select
            value={form.language}
            onValueChange={(value) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      language: value as AppearanceSettings["language"],
                    }
                  : prev
              )
            }
          >
            <SelectTrigger className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="he">עברית</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>{t("settings.appearance.fontSize")}</FieldLabel>
          <Select
            value={form.fontSize}
            onValueChange={(value) =>
              setForm((prev) =>
                prev
                  ? {
                      ...prev,
                      fontSize: value as AppearanceSettings["fontSize"],
                    }
                  : prev
              )
            }
          >
            <SelectTrigger className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                {t("settings.appearance.fontSize.small")}
              </SelectItem>
              <SelectItem value="medium">
                {t("settings.appearance.fontSize.medium")}
              </SelectItem>
              <SelectItem value="large">
                {t("settings.appearance.fontSize.large")}
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="currency">
            {t("settings.appearance.currency")}
          </FieldLabel>
          <Select
            value={form.currency}
            onValueChange={(value) =>
              setForm((prev) => (prev ? { ...prev, currency: value } : prev))
            }
          >
            <SelectTrigger id="currency" className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="ILS">ILS</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3">
          <div>
            <Label htmlFor="compact-mode" className="font-lora text-sm">
              {t("settings.appearance.compact")}
            </Label>
            <p className="font-lora text-xs text-warm-gray">
              {t("settings.appearance.compactHint")}
            </p>
          </div>
          <Switch
            id="compact-mode"
            checked={form.compactMode}
            onCheckedChange={(checked) =>
              setForm((prev) => (prev ? { ...prev, compactMode: checked } : prev))
            }
          />
        </div>

        <Button
          type="submit"
          className="rounded-md"
          disabled={saveStatus === "loading"}
        >
          {saveStatus === "loading"
            ? t("common.saving")
            : t("settings.appearance.save")}
        </Button>
      </FieldGroup>
    </form>
  );
}
