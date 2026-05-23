import "server-only";
import { expressFetch } from "@/lib/auth-server";
import type { Book, ExpressProduct } from "@/features/products/types";
import { mapProductToBook } from "@/features/products/utils/mapProductToBook";

export async function fetchProductsServer(): Promise<Book[]> {
  const res = await expressFetch("/products", { method: "GET" });
  const json = (await res.json()) as {
    message?: string;
    data?: ExpressProduct[];
  };

  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load products");
  }

  const products = json.data ?? [];
  return products.map(mapProductToBook);
}

export async function fetchProductByIdServer(id: string): Promise<Book | null> {
  const res = await expressFetch(`/products/${id}`, { method: "GET" });
  const json = (await res.json()) as {
    message?: string;
    data?: ExpressProduct | null;
  };

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load product");
  }

  const product = json.data;
  if (!product) {
    return null;
  }

  return mapProductToBook(product);
}
