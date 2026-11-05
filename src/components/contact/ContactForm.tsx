"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import httpClient from "@/lib/httpClient";
import { useT } from "@/lib/i18n";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await httpClient.post("/inquiries", { name, email, subject, message });
      toast.success(t("contact.sent"));
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("contact.failed")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-md border border-gold/20 bg-card p-6 shadow-sm md:p-8"
    >
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-name">{t("common.name")}</FieldLabel>
            <Input
              id="contact-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-lora"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">{t("common.email")}</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-lora"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="contact-subject">{t("common.subject")}</FieldLabel>
          <Input
            id="contact-subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-lora"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">{t("common.message")}</FieldLabel>
          <Textarea
            id="contact-message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="font-lora resize-y min-h-32"
          />
        </Field>
        <Button
          type="submit"
          className="w-full rounded-md sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("contact.sending") : t("contact.send")}
        </Button>
      </FieldGroup>
    </form>
  );
}
