"use client";

import Link from "next/link";
import { selectUserRole } from "@/features/auth/store/selectors";
import { useT, type TranslationKey } from "@/lib/i18n";
import { useAppSelector } from "@/store/hooks";

const footerLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/books", labelKey: "nav.books" },
  { href: "/genres", labelKey: "nav.genres" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Footer() {
  const role = useAppSelector(selectUserRole);
  const t = useT();

  return (
    <footer className="mt-auto border-t border-border bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="font-playfair text-xl font-semibold text-ink hover:text-gold"
            >
              {t("brand.name")}
            </Link>
            <p className="mt-3 max-w-xs font-lora text-sm leading-relaxed text-warm-gray">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <p className="font-playfair text-sm font-semibold uppercase tracking-widest text-ink">
              {t("footer.explore")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-lora text-sm sm:flex-col sm:gap-x-0 sm:space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-warm-gray transition-colors hover:text-gold"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-playfair text-sm font-semibold uppercase tracking-widest text-ink">
              {t("footer.visit")}
            </p>
            <p className="mt-4 font-lora text-sm leading-relaxed text-warm-gray">
              {t("footer.addressLine1")}
              <br />
              {t("footer.addressLine2")}
              <br />
              {t("footer.hours")}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 font-lora text-xs text-warm-gray sm:flex-row">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          {role === "admin" || role === "demo-admin" ? (
            <Link
              href="/admin/inquiries"
              className="text-gold hover:underline"
            >
              {t("nav.adminFront")}
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
