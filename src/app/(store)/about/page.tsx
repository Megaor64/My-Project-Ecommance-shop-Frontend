import type { Metadata } from "next";
import { T } from "@/components/i18n/T";

export const metadata: Metadata = {
  title: "About — Folio Books",
  description: "Folio is a finalized student project about literary bookstore.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold"><T k="about.eyebrow" /></p>
      <h1 className="mt-3 font-playfair text-3xl font-semibold text-ink md:text-4xl">
        <T k="about.title" />
      </h1>
      <div className="mt-8 space-y-6 font-lora text-base leading-relaxed text-warm-gray">
        <p>
          <T k="about.paragraph1" />
        </p>
        <p>
          <T k="about.paragraph2" />
        </p>
      </div>
    </article>
  );
}
