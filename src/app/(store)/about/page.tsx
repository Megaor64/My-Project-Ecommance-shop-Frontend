import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Folio Books",
  description: "Folio is a finalized student project about literary bookstore.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold">My story</p>
      <h1 className="mt-3 font-playfair text-3xl font-semibold text-ink md:text-4xl">
        The website's story
      </h1>
      <div className="mt-8 space-y-6 font-lora text-base leading-relaxed text-warm-gray">
        <p>
        Folio is a finalized student project that showcases my skills and knowledge as a Full-Stack Developer.
        It is a fully functional webstore designed to demonstrate my ability to build modern web applications, combining both Front-End and Back-End development.
        </p>
        <p>
        Folio is free to explore, so feel welcome to browse the website and discover what it has to offer!        
        </p>
      </div>
    </article>
  );
}
