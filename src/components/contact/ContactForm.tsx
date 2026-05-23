"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? "Could not send your message");
      }
      toast.success("Your message has been sent. We'll reply soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send your message."
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
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
              id="contact-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="font-lora"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
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
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input
            id="contact-subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-lora"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
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
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </FieldGroup>
    </form>
  );
}
