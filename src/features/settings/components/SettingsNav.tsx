"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT, type TranslationKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const links: { href: string; labelKey: TranslationKey }[] = [
  { href: "/account/settings/appearance", labelKey: "settings.nav.appearance" },
  {
    href: "/account/settings/notifications",
    labelKey: "settings.nav.notifications",
  },
  { href: "/account/settings/security", labelKey: "settings.nav.security" },
];

export function SettingsNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <nav className="flex flex-col gap-1 font-lora text-sm">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 transition-colors",
              active
                ? "bg-gold/15 font-medium text-ink"
                : "text-warm-gray hover:bg-muted hover:text-ink"
            )}
          >
            {t(link.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
