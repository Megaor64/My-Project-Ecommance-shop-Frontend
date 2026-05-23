import { AuthGoogleProvider } from "@/components/auth/AuthGoogleProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGoogleProvider>
      <div className="flex min-h-screen w-full items-center justify-center bg-parchment px-4 py-12">
        {children}
      </div>
    </AuthGoogleProvider>
  );
}
