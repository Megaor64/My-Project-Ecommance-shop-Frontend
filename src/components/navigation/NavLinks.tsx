"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Books" },
  { href: "/genres", label: "Genres" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Account" },
];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-5 xl:gap-6",
        className
      )}
      aria-label="Main"
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
