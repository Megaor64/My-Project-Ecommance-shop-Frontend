import httpClient from "@/lib/httpClient";
import type { CartItem, GuestCartItem } from "@/features/cart/types";

type RawCartItem = {
  productId?: string | { _id?: string };
  name?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  imageUrl?: string;
};

function normalizeProductId(value: RawCartItem["productId"]): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return String(value._id ?? "");
}

function normalizeCartItem(raw: RawCartItem): CartItem | null {
  const productId = normalizeProductId(raw.productId);
  if (!productId) return null;
  return {
    productId,
    name: raw.name ?? "Product",
    price: Number(raw.price) || 0,
    quantity: Number(raw.quantity) || 1,
    stock: raw.stock,
    imageUrl: raw.imageUrl,
  };
}

function normalizeCartResponse(data: unknown): CartItem[] {
  const payload = data as { items?: RawCartItem[] } | RawCartItem[];
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];
  return items
    .map(normalizeCartItem)
    .filter((item): item is CartItem => item !== null);
}

export async function getCart(userId: string): Promise<CartItem[]> {
  const { data } = await httpClient.get(`/cart/${userId}`);
  return normalizeCartResponse(data);
}

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem[]> {
  const { data } = await httpClient.post(`/cart/${userId}`, {
    productId,
    quantity,
  });
  return normalizeCartResponse(data);
}

export async function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem[]> {
  const { data } = await httpClient.patch(`/cart/${userId}`, {
    productId,
    quantity,
  });
  return normalizeCartResponse(data);
}

export async function removeCartItem(
  userId: string,
  productId: string
): Promise<CartItem[]> {
  const { data } = await httpClient.delete(
    `/cart/${userId}/items/${productId}`
  );
  return normalizeCartResponse(data);
}

export async function clearCartApi(userId: string): Promise<CartItem[]> {
  const { data } = await httpClient.delete(`/cart/${userId}/clear`);
  return normalizeCartResponse(data);
}

export async function syncGuestCartApi(
  userId: string,
  items: GuestCartItem[]
): Promise<CartItem[]> {
  const { data } = await httpClient.post(`/cart/${userId}/sync`, { items });
  return normalizeCartResponse(data);
}
