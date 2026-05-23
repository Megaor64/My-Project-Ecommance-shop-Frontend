import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";

export const metadata: Metadata = {
  title: "Folio Books — Literary Bookstore",
  description:
    "A curated literary bookstore for readers who love the written word.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBooks />
    </>
  );
}
