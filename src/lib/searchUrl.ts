export type SearchablePage = "/books" | "/genres";

/** Static export uses `trailingSlash: true`, so `/books/` must match `/books`. */
export function normalizePath(pathname: string | null | undefined): string {
  if (!pathname) return "";
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isSearchablePath(pathname: string | null): boolean {
  const path = normalizePath(pathname);
  return path === "/books" || path === "/genres";
}

export function getSearchPage(pathname: string): SearchablePage {
  if (normalizePath(pathname) === "/genres") return "/genres";
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
