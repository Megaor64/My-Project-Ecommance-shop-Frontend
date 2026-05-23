import Link from "next/link";
import { AdminStatsBanner } from "@/components/admin/AdminStatsBanner";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment text-ink dark:bg-cream">
      <header className="border-b border-border bg-burgundy text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="font-playfair text-xl font-semibold">Folio Staff</p>
            <p className="font-lora text-xs opacity-80">Administration</p>
            <AdminStatsBanner />
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4 font-lora text-sm">
              <Link href="/admin/inquiries" className="hover:underline">
                Inquiries
              </Link>
              <Link href="/admin/products" className="hover:underline">
                Products
              </Link>
              <Link href="/admin/users" className="hover:underline">
                Users
              </Link>
              <Link href="/" className="hover:underline opacity-80">
                Storefront
              </Link>
            </nav>
            <ThemeToggle className="text-cream hover:text-gold" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
