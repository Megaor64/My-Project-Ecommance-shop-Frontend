export type SearchablePage = "/books" | "/genres";

export function getSearchPage(pathname: string): SearchablePage {
  if (pathname === "/genres") return "/genres";
  return "/books";
}

export function buildSearchUrl(
  page: SearchablePage,
  query: string,
  maxPrice: number
): string {
  const params = new URLSearchParams();
  const q = query.trim();
  if (q) params.set("q", q);
  if (maxPrice > 0) params.set("max", String(maxPrice));
  const qs = params.toString();
  return qs ? `${page}?${qs}` : page;
}
