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
import { selectSettingsSaveStatus } from "@/features/settings/store/selectors";
import { updateAppearance } from "@/features/settings/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type AppearanceFormProps = {
  initialValues: AppearanceSettings;
};

export function AppearanceForm({ initialValues }: AppearanceFormProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const saveStatus = useAppSelector(selectSettingsSaveStatus);
  const { setTheme } = useTheme();
  const [form, setForm] = useState(initialValues);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      await dispatch(
        updateAppearance({ userId: user.id, appearance: form })
      ).unwrap();
      if (form.theme !== "system") {
        setTheme(form.theme);
      }
      toast.success("העדפות העיצוב נשמרו");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "שמירה נכשלה");
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>ערכת נושא</FieldLabel>
          <Select
            value={form.theme}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                theme: value as AppearanceSettings["theme"],
              }))
            }
          >
            <SelectTrigger className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">בהיר</SelectItem>
              <SelectItem value="dark">כהה</SelectItem>
              <SelectItem value="system">מערכת</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>שפה</FieldLabel>
          <Select
            value={form.language}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                language: value as AppearanceSettings["language"],
              }))
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
          <FieldLabel>גודל גופן</FieldLabel>
          <Select
            value={form.fontSize}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                fontSize: value as AppearanceSettings["fontSize"],
              }))
            }
          >
            <SelectTrigger className="font-lora">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">קטן</SelectItem>
              <SelectItem value="medium">בינוני</SelectItem>
              <SelectItem value="large">גדול</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="currency">מטבע</FieldLabel>
          <Select
            value={form.currency}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, currency: value }))
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
              מצב קומפקטי
            </Label>
            <p className="font-lora text-xs text-warm-gray">
              צפוף יותר ברשימות וטבלאות
            </p>
          </div>
          <Switch
            id="compact-mode"
            checked={form.compactMode}
            onCheckedChange={(checked) =>
              setForm((prev) => ({ ...prev, compactMode: checked }))
            }
          />
        </div>

        <Button
          type="submit"
          className="rounded-md"
          disabled={saveStatus === "loading"}
        >
          {saveStatus === "loading" ? "שומר…" : "שמור עיצוב"}
        </Button>
      </FieldGroup>
    </form>
  );
}
