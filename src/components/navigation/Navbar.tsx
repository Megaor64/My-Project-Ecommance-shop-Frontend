"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Search, User } from "lucide-react";
import { CartSheet } from "@/features/cart/components/CartSheet";
import {
  selectAuthLoading,
  selectIsAdmin,
  selectIsAuthenticated,
  selectUser,
} from "@/features/auth/store/selectors";
import { useAppSelector } from "@/store/hooks";
import { useSearch } from "@/components/providers/SearchProvider";
import { NavLinks } from "@/components/navigation/NavLinks";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const { setSearchOpen } = useSearch();

  function handleSearchClick() {
    if (pathname === "/") {
      router.push("/books");
    }
    setSearchOpen(true);
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-parchment/95 backdrop-blur-sm">
      <div className="relative flex w-full items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="relative z-10 shrink-0">
          <Link
            href="/"
            className="font-playfair text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            Folio
          </Link>
        </div>

        <NavLinks className="pointer-events-none absolute left-1/2 hidden max-w-[min(100%,36rem)] -translate-x-1/2 px-2 xl:pointer-events-auto xl:flex" />

        <div className="relative z-10 ml-auto flex shrink-0 flex-wrap items-center justify-end gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open search"
            className="shrink-0 text-ink hover:text-gold"
            onClick={handleSearchClick}
          >
            <Search className="size-4" />
          </Button>
          <ThemeToggle className="shrink-0" />
          <CartSheet />
          {!isLoading && isAdmin ? (
            <>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="shrink-0 rounded-md border-burgundy/40 text-burgundy hover:bg-burgundy hover:text-cream xl:hidden"
              >
                <Link href="/admin/inquiries" aria-label="Admin dashboard">
                  <LayoutDashboard className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden shrink-0 rounded-md border-burgundy/40 font-lora normal-case tracking-normal text-burgundy hover:bg-burgundy hover:text-cream xl:inline-flex"
              >
                <Link href="/admin/inquiries">AdminFront</Link>
              </Button>
            </>
          ) : null}
          {!isLoading && isAuthenticated && user ? (
            <Link href="/account" aria-label="Account" className="shrink-0">
              <Avatar className="size-9 border border-gold/40">
                <AvatarFallback className="bg-cream font-lora text-xs text-ink">
                  {initials ?? <User className="size-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                size="icon"
                className="shrink-0 rounded-md border-ink/20 sm:hidden"
              >
                <Link href="/login" aria-label="Sign in">
                  <User className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden shrink-0 rounded-md border-ink/20 font-lora normal-case tracking-normal sm:inline-flex"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <NavLinks className="gap-x-4 border-t border-border/40 px-4 py-2.5 sm:px-6 sm:py-3 xl:hidden lg:px-8" />
    </header>
  );
}
