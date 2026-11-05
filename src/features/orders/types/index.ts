export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod?: {
    cardholderName: string;
    cardLast4: string;
    expiration: string;
  };
};

/** `locale` comes from `useLocale().locale` (defaults to English). */
export function formatOrderDate(iso: string, locale = "en-US"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function orderStatusLabel(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
