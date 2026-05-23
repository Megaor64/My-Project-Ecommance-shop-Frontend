export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  genre: string;
  coverImage?: string;
  coverColor: string;
  rating: number;
  description: string;
  publishedYear?: number;
  stock: number;
};

export type ExpressProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
};

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
};
