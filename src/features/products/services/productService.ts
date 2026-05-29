import httpClient from "@/lib/httpClient";
import type { Book, ExpressProduct } from "@/features/products/types";
import { mapProductToBook } from "@/features/products/utils/mapProductToBook";

function mapProductsResponse(data: unknown): Book[] {
  const products = (Array.isArray(data) ? data : []) as ExpressProduct[];
  return products.map(mapProductToBook);
}

export async function fetchProducts(): Promise<Book[]> {
  const { data } = await httpClient.get<ExpressProduct[]>("/products");
  return mapProductsResponse(data);
}

export async function fetchProductById(id: string): Promise<Book> {
  const { data } = await httpClient.get<ExpressProduct>(`/products/${id}`);
  return mapProductToBook(data);
}

export async function createProduct(formData: FormData): Promise<ExpressProduct> {
  const { data } = await httpClient.post<ExpressProduct>("/products", formData);
  return data;
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ExpressProduct> {
  const { data } = await httpClient.patch<ExpressProduct>(
    `/products/${id}`,
    formData
  );
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await httpClient.delete(`/products/${id}`);
}
