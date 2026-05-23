"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account/settings/appearance", label: "עיצוב" },
  { href: "/account/settings/notifications", label: "התראות" },
  { href: "/account/settings/security", label: "אבטחה" },
] as const;

export function SettingsNav() {
  const pathname = usePathname();

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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
