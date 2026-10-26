export type Restaurant = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  minutes: number;
  fee: number;
  open?: boolean;
  minimum?: number;
};
export type Product = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  active: boolean;
};
export type CartItem = {
  key: string;
  product: Product;
  quantity: number;
  size: string;
  crust: string;
  extras: string[];
  note: string;
  unitPrice: number;
};
export type OrderStatus =
  "new" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
export type Order = {
  id: string;
  restaurant_id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  fee: number;
  total: number;
  status: OrderStatus;
  address: string;
  payment: string;
  created_at: string;
};
export type Profile = {
  name: string;
  phone: string;
  addresses: { id: string; label: string; street: string }[];
};
export type StoreSettings = {
  name: string;
  description: string;
  fee: number;
  minimum: number;
  minutes: number;
  open: boolean;
  address: string;
  hours: string;
};
export type Catalog = { restaurants: Restaurant[]; products: Product[] };
