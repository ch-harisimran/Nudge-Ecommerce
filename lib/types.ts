export type Role = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  stock_qty: number;
  image_url: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  subtotal: string;
  discount_code: string | null;
  discount_amount: string;
  total: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: string;
  product?: Product;
}

export const CATEGORIES = [
  "Candles",
  "Planters & Pots",
  "Ceramics & Tableware",
  "Textiles & Throws",
  "Wall Decor",
  "Storage Baskets",
] as const;

export type Category = (typeof CATEGORIES)[number];
