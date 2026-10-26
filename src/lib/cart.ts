import type { CartItem, Product } from "@/types";
export const extraOptions = [
  { name: "Borda de catupiry", price: 8 },
  { name: "Queijo extra", price: 6 },
  { name: "Calabresa extra", price: 6 },
  { name: "Cebola extra", price: 3 },
];
export function itemPrice(product: Product, size: string, extras: string[]) {
  const base = Math.round(Number(product.price) * 100);
  const sizeCost = size === "Pequena" ? -1000 : size === "Grande" ? 1000 : 0;
  const extraCost = extras.reduce(
    (sum, name) =>
      sum +
      Math.round((extraOptions.find((e) => e.name === name)?.price ?? 0) * 100),
    0,
  );
  return Math.max(0, base + sizeCost + extraCost) / 100;
}
export function totals(items: CartItem[], fee: number, coupon: string) {
  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
    0,
  );
  const discountCents =
    coupon === "PIZZA10" ? Math.round(subtotalCents * 0.1) : 0;
  const feeCents = items.length ? Math.round(fee * 100) : 0;
  return {
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    fee: feeCents / 100,
    total: Math.max(0, subtotalCents - discountCents + feeCents) / 100,
  };
}
export function isCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;
  const i = item as CartItem;
  return (
    typeof i.key === "string" &&
    typeof i.product?.id === "string" &&
    typeof i.product.restaurant_id === "string" &&
    typeof i.product.name === "string" &&
    typeof i.product.image === "string" &&
    Number.isFinite(i.product.price) &&
    Number.isInteger(i.quantity) &&
    i.quantity >= 1 &&
    i.quantity <= 20 &&
    Number.isFinite(i.unitPrice) &&
    i.unitPrice >= 0 &&
    typeof i.size === "string" &&
    typeof i.crust === "string" &&
    Array.isArray(i.extras) &&
    i.extras.every((e) => typeof e === "string") &&
    typeof i.note === "string"
  );
}
export function addCartItem(items: CartItem[], item: CartItem): CartItem[] {
  const sameStore =
    items.length === 0 ||
    items[0].product.restaurant_id === item.product.restaurant_id;
  const current = sameStore ? items : [];
  const exists = current.some((i) => i.key === item.key);
  return exists
    ? current.map((i) =>
        i.key === item.key
          ? { ...i, quantity: Math.min(20, i.quantity + item.quantity) }
          : i,
      )
    : [...current, { ...item, quantity: Math.min(20, item.quantity) }];
}
export function changeCartQuantity(
  items: CartItem[],
  key: string,
  delta: number,
) {
  return items
    .map((i) =>
      i.key === key ? { ...i, quantity: Math.min(20, i.quantity + delta) } : i,
    )
    .filter((i) => i.quantity > 0);
}
