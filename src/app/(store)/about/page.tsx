import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Folio Books",
  description: "The story behind Folio — a literary bookstore built on recommendation.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold">Our story</p>
      <h1 className="mt-3 font-playfair text-3xl font-semibold text-ink md:text-4xl">
        A room for readers
      </h1>
      <div className="mt-8 space-y-6 font-lora text-base leading-relaxed text-warm-gray">
        <p>
          Folio began as a single shelf in a Portland attic — a place where friends
          traded paperbacks and argued gently about endings. Today we are still that
          room, only larger: a bookstore built on recommendation, not algorithm.
        </p>
        <p>
          Every title on our shelves is chosen by people who read for pleasure and
          profession. We favor independent presses, translated voices, and books that
          reward a second reading.
        </p>
        <p>
          Whether you visit in person or browse from home, we hope you leave with
          something unexpected and exactly right.
        </p>
      </div>
    </article>
  );
}
