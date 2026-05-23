import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Folio Books",
  description: "Send us a message about orders, events, or recommendations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold">
        Get in touch
      </p>
      <h1 className="mt-3 font-playfair text-3xl font-semibold text-ink md:text-4xl">
        Contact us
      </h1>
      <p className="mt-4 font-lora leading-relaxed text-warm-gray">
        Questions about an order, a reading group, or a title we should stock?
        Write to us — our team reads every message.
      </p>
      <ContactForm />
    </div>
  );
}
