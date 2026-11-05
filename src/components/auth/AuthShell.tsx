"use client";

import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  variant?: "customer" | "admin";
  children: React.ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  variant = "customer",
  children,
}: AuthShellProps) {
  const t = useT();
  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-md border border-border bg-cream shadow-sm md:grid-cols-2">
      <aside
        className={cn(
          "hidden flex-col justify-between p-10 md:flex",
          variant === "admin" ? "bg-burgundy text-cream" : "bg-ink text-parchment"
        )}
      >
        <div>
          <p className="font-playfair text-3xl font-semibold tracking-tight">
            {t("brand.name")}
          </p>
          <p className="mt-2 font-lora text-sm opacity-80">
            {variant === "admin"
              ? t("auth.shell.staffPortal")
              : t("auth.shell.tagline")}
          </p>
        </div>
        <p className="font-lora text-sm leading-relaxed opacity-75">
          {variant === "admin"
            ? t("auth.shell.staffDescription")
            : t("auth.shell.description")}
        </p>
      </aside>
      <div className="p-8 md:p-10">
        <header className="mb-8">
          <h1 className="font-playfair text-2xl font-semibold text-ink">{title}</h1>
          {subtitle ? (
            <p className="mt-2 font-lora text-sm text-warm-gray">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  );
}
