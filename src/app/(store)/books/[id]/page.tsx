import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOrderPageClient } from "@/features/products/components/BookOrderPageClient";
import { fetchProductByIdServer } from "@/features/products/services/productServer";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await fetchProductByIdServer(id);
  if (!book) {
    return { title: "Book not found — Folio Books" };
  }
  return {
    title: `${book.title} — Folio Books`,
    description: book.description.slice(0, 160),
  };
}

export default async function BookOrderPage({ params }: PageProps) {
  const { id } = await params;
  const book = await fetchProductByIdServer(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <BookOrderPageClient book={book} />
    </div>
  );
}
