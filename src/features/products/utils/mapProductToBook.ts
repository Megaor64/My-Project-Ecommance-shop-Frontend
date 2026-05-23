import type { Book, ExpressProduct } from "@/features/products/types";

const COVER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.45 0.1 25), oklch(0.32 0.08 30))",
  "linear-gradient(135deg, oklch(0.52 0.06 155), oklch(0.38 0.05 160))",
  "linear-gradient(135deg, oklch(0.55 0.08 85), oklch(0.4 0.06 70))",
  "linear-gradient(135deg, oklch(0.5 0.14 300), oklch(0.35 0.1 280))",
  "linear-gradient(135deg, oklch(0.48 0.12 45), oklch(0.3 0.08 40))",
  "linear-gradient(135deg, oklch(0.35 0.03 50), oklch(0.22 0.03 50))",
];

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function coverColorFromId(id: string): string {
  return COVER_GRADIENTS[hashId(id) % COVER_GRADIENTS.length];
}

export function parseAuthor(description: string): string {
  const match = description.match(/Author:\s*([^.\n]+)/i);
  return match?.[1]?.trim() ?? "Various Authors";
}

/** Strips the `Author: …` prefix; supports period, single newline, or blank-line separators. */
export function parseDescriptionBody(description: string): string {
  const trimmed = (description ?? "").trim();
  if (!trimmed) return "";

  const doubleNewline = trimmed.match(/^Author:\s*.+?\n\n([\s\S]*)$/i);
  if (doubleNewline) return doubleNewline[1].trim();

  const afterPeriod = trimmed.match(/^Author:\s*[^.]+\.\s*([\s\S]*)$/i);
  if (afterPeriod) return afterPeriod[1].trim();

  const singleNewline = trimmed.match(/^Author:\s*.+?\n([\s\S]*)$/i);
  if (singleNewline) return singleNewline[1].trim();

  if (/^Author:\s*/i.test(trimmed)) {
    return trimmed.replace(/^Author:\s*[^\n.]+[.\n]?\s*/i, "").trim();
  }

  return trimmed;
}

export function formatAuthorDescription(author: string, body: string): string {
  const a = author.trim();
  const b = body.trim();
  if (!a && !b) return "";
  if (!a) return b;
  if (!b) return `Author: ${a}`;
  return `Author: ${a}\n\n${b}`;
}

export function mapProductToBook(product: ExpressProduct): Book {
  const id = String(product._id);
  const rawDescription = product.description ?? "";
  const body = parseDescriptionBody(rawDescription);
  return {
    id,
    title: product.name,
    author: parseAuthor(rawDescription),
    price: product.price,
    genre: product.category?.trim() || "General",
    coverImage: product.imageUrl || undefined,
    coverColor: coverColorFromId(id),
    rating: 4 + (hashId(id) % 10) / 10,
    description: body || product.name,
    publishedYear: 2018 + (hashId(id) % 7),
    stock: product.stock ?? 0,
  };
}

export function filterBooks(
  books: Book[],
  query: string,
  maxPrice?: number
): Book[] {
  const q = query.trim().toLowerCase();
  return books.filter((book) => {
    const matchesQuery =
      !q ||
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.genre.toLowerCase().includes(q);
    const matchesPrice =
      maxPrice === undefined || maxPrice <= 0 || book.price <= maxPrice;
    return matchesQuery && matchesPrice;
  });
}

export function groupBooksByGenre(books: Book[]): Record<string, Book[]> {
  return books.reduce<Record<string, Book[]>>((acc, book) => {
    const genre = book.genre || "General";
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(book);
    return acc;
  }, {});
}
