"use client";

import Link from "next/link";
import { selectUserRole } from "@/features/auth/store/selectors";
import { useAppSelector } from "@/store/hooks";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/genres", label: "Genres" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const role = useAppSelector(selectUserRole);

  return (
    <footer className="mt-auto border-t border-border bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-playfair text-xl font-semibold text-ink hover:text-gold"
            >
              Folio
            </Link>
            <p className="mt-3 max-w-xs font-lora text-sm leading-relaxed text-warm-gray">
              A literary bookstore for readers who savor slow stories and
              well-worn spines.
            </p>
          </div>
          <div>
            <p className="font-playfair text-sm font-semibold uppercase tracking-widest text-ink">
              Explore
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-lora text-sm sm:flex-col sm:gap-x-0 sm:space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-gray transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-playfair text-sm font-semibold uppercase tracking-widest text-ink">
              Visit
            </p>
            <p className="mt-4 font-lora text-sm leading-relaxed text-warm-gray">
              42 Quill Lane
              <br />
              Portland, OR
              <br />
              Open daily · 10am–7pm
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 font-lora text-xs text-warm-gray sm:flex-row">
          <p>© {new Date().getFullYear()} Folio Books. All rights reserved.</p>
          {role === "admin" ? (
            <Link
              href="/admin/inquiries"
              className="text-gold hover:underline"
            >
              AdminFront
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
