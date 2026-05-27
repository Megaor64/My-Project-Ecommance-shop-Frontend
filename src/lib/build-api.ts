import { getApiBaseUrl } from "@/lib/api";

type ExpressProduct = {
  _id?: string;
  id?: string;
};

export async function fetchProductIdsForBuild(): Promise<string[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const json = (await res.json()) as { data?: ExpressProduct[] };
    const products = json.data ?? [];
    return products
      .map((product) => String(product._id ?? product.id ?? ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}
