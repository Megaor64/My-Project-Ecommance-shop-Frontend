import Link from "next/link";
import { DemoBanner } from "@/components/admin/DemoBanner";
import { AdminStatsBanner } from "@/components/admin/AdminStatsBanner";
import { T } from "@/components/i18n/T";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard loginPath="/admin/login" requireAdmin>
      <div className="min-h-screen bg-parchment text-ink dark:bg-cream">
      <DemoBanner />
      <header className="border-b border-border bg-burgundy text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-playfair text-xl font-semibold"><T k="staff.portalTitle" /></p>
            <p className="font-lora text-xs opacity-80"><T k="staff.administration" /></p>
            <AdminStatsBanner />
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4 font-lora text-sm">
              <Link href="/admin/inquiries" className="hover:underline">
                <T k="admin.inquiries.nav" />
              </Link>
              <Link href="/admin/products" className="hover:underline">
                <T k="admin.products.title" />
              </Link>
              <Link href="/admin/users" className="hover:underline">
                <T k="admin.users.nav" />
              </Link>
              <Link href="/" className="hover:underline opacity-80">
                <T k="staff.storefront" />
              </Link>
            </nav>
            <ThemeToggle className="text-cream hover:text-gold" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </div>
    </RouteGuard>
  );
}
