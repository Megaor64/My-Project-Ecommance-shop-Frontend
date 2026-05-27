import type { Metadata } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";
import { SettingsBootstrap } from "@/features/settings/components/SettingsBootstrap";
import { CartBootstrap } from "@/features/cart/components/CartBootstrap";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "Folio Books — Literary Bookstore",
  description: "A curated literary bookstore for readers who love the written word.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full antialiased", playfair.variable, lora.variable)}
    >
      <body className="min-h-full flex flex-col bg-parchment font-lora text-ink">
        <ThemeProvider>
          <StoreProvider>
            <AuthBootstrap />
            <SettingsBootstrap />
            <CartBootstrap />
            {children}
            <Toaster richColors position="top-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
