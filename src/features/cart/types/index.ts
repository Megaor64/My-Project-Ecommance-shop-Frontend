export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  imageUrl?: string;
};

export type GuestCartItem = {
  productId: string;
  quantity: number;
};

export type GuestCart = {
  items: GuestCartItem[];
};
