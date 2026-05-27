import { RouteGuard } from "@/components/auth/RouteGuard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">{children}</div>
    </RouteGuard>
  );
}
