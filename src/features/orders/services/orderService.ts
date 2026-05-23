import httpClient from "@/lib/httpClient";
import type { Order } from "@/features/orders/types";

export type ShippingAddress = {
  street: string;
  city: string;
  zip: string;
  country: string;
};

export type PaymentMethodInput = {
  cardholderName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
};

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodInput;
};

function normalizeOrder(payload: unknown): Order {
  if (payload && typeof payload === "object" && "order" in payload) {
    return (payload as { order: Order }).order;
  }
  return payload as Order;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await httpClient.get<Order[]>("/orders");
  return Array.isArray(data) ? data : [];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await httpClient.post<unknown>("/orders", payload);
  return normalizeOrder(data);
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const { data } = await httpClient.patch<unknown>(`/orders/${orderId}/cancel`);
  return normalizeOrder(data);
}

export async function deleteOrder(orderId: string): Promise<void> {
  await httpClient.delete(`/orders/${orderId}`);
}
