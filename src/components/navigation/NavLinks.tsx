"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT, type TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const links: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/books", labelKey: "nav.books" },
  { href: "/genres", labelKey: "nav.genres" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/account", labelKey: "nav.account" },
];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-5 xl:gap-6",
        className
      )}
      aria-label={t("nav.main")}
    >
      {links.map((link) => {
        const active = isNavLinkActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap font-lora text-xs tracking-wide transition-colors sm:text-sm",
              active
                ? "text-gold underline underline-offset-4"
                : "text-ink hover:text-gold"
            )}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
