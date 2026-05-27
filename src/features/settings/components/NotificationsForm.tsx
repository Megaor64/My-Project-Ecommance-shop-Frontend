"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { selectUser } from "@/features/auth/store/selectors";
import type { NotificationSettings } from "@/features/settings/types";
import { selectSettingsSaveStatus, selectSettings } from "@/features/settings/store/selectors";
import { updateNotifications } from "@/features/settings/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type NotificationsFormProps = {
  initialValues?: NotificationSettings;
};

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3">
      <div>
        <Label htmlFor={id} className="font-lora text-sm">
          {label}
        </Label>
        {description ? (
          <p className="font-lora text-xs text-warm-gray">{description}</p>
        ) : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function NotificationsForm({ initialValues }: NotificationsFormProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  const saveStatus = useAppSelector(selectSettingsSaveStatus);
  const resolved = initialValues ?? settings?.notifications;

  const [form, setForm] = useState<NotificationSettings | null>(resolved ?? null);

  useEffect(() => {
    if (resolved) {
      setForm(resolved);
    }
  }, [resolved]);

  if (!form) {
    return <p className="font-lora text-warm-gray">טוען הגדרות…</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !form) return;
    try {
      await dispatch(
        updateNotifications({ userId: user.id, notifications: form })
      ).unwrap();
      toast.success("העדפות ההתראות נשמרו");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "שמירה נכשלה");
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      <section className="space-y-3">
        <h2 className="font-playfair text-lg text-ink">דוא״ל</h2>
        <ToggleRow
          id="email-order-updates"
          label="עדכוני הזמנה"
          checked={form.email.orderUpdates}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? { ...prev, email: { ...prev.email, orderUpdates: checked } }
                : prev
            )
          }
        />
        <ToggleRow
          id="email-marketing"
          label="שיווק"
          checked={form.email.marketing}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev ? { ...prev, email: { ...prev.email, marketing: checked } } : prev
            )
          }
        />
        <ToggleRow
          id="email-newsletter"
          label="ניוזלטר"
          checked={form.email.newsletter}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? { ...prev, email: { ...prev.email, newsletter: checked } }
                : prev
            )
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair text-lg text-ink">דפדפן</h2>
        <ToggleRow
          id="browser-order-updates"
          label="עדכוני הזמנה"
          checked={form.browser.orderUpdates}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? {
                    ...prev,
                    browser: { ...prev.browser, orderUpdates: checked },
                  }
                : prev
            )
          }
        />
        <ToggleRow
          id="browser-promotions"
          label="מבצעים"
          checked={form.browser.promotions}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? { ...prev, browser: { ...prev.browser, promotions: checked } }
                : prev
            )
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-playfair text-lg text-ink">SMS</h2>
        <div>
          <Label htmlFor="sms-phone" className="font-lora text-sm">
            מספר טלפון
          </Label>
          <Input
            id="sms-phone"
            value={form.sms.phone}
            onChange={(e) =>
              setForm((prev) =>
                prev
                  ? { ...prev, sms: { ...prev.sms, phone: e.target.value } }
                  : prev
              )
            }
            className="mt-1 font-lora"
            placeholder="+972..."
          />
        </div>
        <ToggleRow
          id="sms-order-updates"
          label="עדכוני הזמנה"
          checked={form.sms.orderUpdates}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? { ...prev, sms: { ...prev.sms, orderUpdates: checked } }
                : prev
            )
          }
        />
        <ToggleRow
          id="sms-promotions"
          label="מבצעים"
          checked={form.sms.promotions}
          onCheckedChange={(checked) =>
            setForm((prev) =>
              prev
                ? { ...prev, sms: { ...prev.sms, promotions: checked } }
                : prev
            )
          }
        />
      </section>

      <Button
        type="submit"
        className="rounded-md"
        disabled={saveStatus === "loading"}
      >
        {saveStatus === "loading" ? "שומר…" : "שמור התראות"}
      </Button>
    </form>
  );
}
