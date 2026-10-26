import { demoCatalogProducts } from "@/lib/demo-catalog-products";
import type {
  Catalog,
  Product,
  Order,
  Profile,
  StoreSettings,
  CartItem,
} from "@/types";
export const previewRestaurants: Catalog["restaurants"] = [
  {
    id: "bella-massa",
    name: "Pizzaria Bella Massa",
    category: "Pizza",
    description: "Pizza artesanal, feita com amor",
    image: "/assets/pizza.jpg",
    rating: 4.9,
    minutes: 25,
    fee: 6,
  },
  {
    id: "burger-house",
    name: "Burger House",
    category: "Hambúrguer",
    description: "Brasa acesa. Fome resolvida.",
    image: "/assets/burger.jpg",
    rating: 4.8,
    minutes: 20,
    fee: 0,
  },
  {
    id: "sushi-yama",
    name: "Sushi Yama",
    category: "Japonesa",
    description: "O melhor do Japão por aqui",
    image: "/assets/sushi.jpg",
    rating: 4.9,
    minutes: 35,
    fee: 6,
  },
  {
    id: "forno-italia",
    name: "Forno da Vila",
    category: "Pizza",
    description: "Tradição italiana em cada fatia",
    image: "/assets/hero.jpg",
    rating: 4.8,
    minutes: 30,
    fee: 5,
  },
  {
    id: "cantina-urbana",
    name: "Cantina Urbana",
    category: "Brasileira",
    description: "Comida de casa, todo dia",
    image: "/assets/burger.jpg",
    rating: 4.7,
    minutes: 20,
    fee: 0,
  },
  {
    id: "pizza-chef",
    name: "Pizza do Chef",
    category: "Pizza",
    description: "Criatividade que dá água na boca",
    image: "/assets/pizza.jpg",
    rating: 4.8,
    minutes: 25,
    fee: 0,
  },
];
export const previewProducts: Product[] = demoCatalogProducts;
export const previewCart: CartItem[] = [
  {
    key: "preview-calabresa",
    product: previewProducts[1],
    quantity: 1,
    size: "Média",
    crust: "Tradicional",
    extras: [],
    note: "Bem assada, por favor.",
    unitPrice: 52.9,
  },
];
export const previewProfile: Profile = {
  name: "Ana Silva",
  phone: "(43) 99999-0000",
  addresses: [
    {
      id: "b316312a-272f-47ed-9d9d-cbbcadfc76a8",
      label: "Casa",
      street: "Rua das Flores, 120, Centro, Ibiporã — PR",
    },
    {
      id: "b316312a-272f-47ed-9d9d-cbbcadfc76a9",
      label: "Trabalho",
      street: "Avenida Paraná, 500, Centro, Ibiporã — PR",
    },
  ],
};
export const previewSettings: StoreSettings = {
  name: "Pizzaria Bella Massa",
  description:
    "A combinação perfeita entre ingredientes selecionados e massa artesanal.",
  fee: 6,
  minimum: 20,
  minutes: 25,
  open: true,
  address: "Rua Santos Dumont, Centro, Ibiporã — PR",
  hours: "Terça a domingo • 18h às 23h",
};
export const previewOrder: Order = {
  id: "12480000-0000-4000-8000-000000000001",
  user_id: "preview",
  restaurant_id: "bella-massa",
  items: previewCart,
  subtotal: 52.9,
  discount: 0,
  fee: 6,
  total: 58.9,
  status: "preparing",
  address: previewProfile.addresses[0].street,
  payment: "PIX",
  created_at: "2026-10-26T17:00:00Z",
};
export const previewOrders: Order[] = Array.from({ length: 7 }, (_, i) => ({
  ...previewOrder,
  id:
    i === 0
      ? previewOrder.id
      : String(124800 + i) +
        "00-0000-4000-8000-" +
        String(i + 1).padStart(12, "0"),
  status: (
    [
      "preparing",
      "new",
      "ready",
      "delivering",
      "delivered",
      "delivered",
      "delivered",
    ] as const
  )[i],
  created_at: new Date(Date.UTC(2026, 9, 26 - i, 16)).toISOString(),
  total: 58.9 + i * 12,
  subtotal: 52.9 + i * 12,
}));
