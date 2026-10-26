import { createId } from "@/lib/id";
import { totals, itemPrice } from "@/lib/cart";
import {
  previewRestaurants,
  previewProducts,
  previewOrders,
  previewProfile,
  previewSettings,
} from "@/lib/preview-data";
const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const initialState = {
  catalog: {
    restaurants: copy(previewRestaurants),
    products: copy(previewProducts),
  },
  orders: copy(previewOrders),
  profile: copy(previewProfile),
  settings: copy(previewSettings),
};
function readState() {
  try {
    const raw = sessionStorage.getItem("eyi-preview-data-v3");
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.catalog && saved.orders && saved.profile && saved.settings)
        return saved as typeof initialState;
    }
  } catch {}
  return copy(initialState);
}
export async function previewRequest<T>(
  path: string,
  options: RequestInit,
): Promise<T> {
  const state = readState();
  const route = path.split("?")[0];
  const method = options.method || "GET";
  const body = typeof options.body === "string" ? JSON.parse(options.body) : {};
  let result: unknown;
  if (route === "catalog") result = state.catalog;
  else if (route === "profile") {
    if (method === "PUT") state.profile = body;
    result = state.profile;
  } else if (route === "settings") {
    if (method === "PUT") {
      state.settings = body;
      state.catalog.restaurants = state.catalog.restaurants.map((r) =>
        r.id === "bella-massa"
          ? {
              ...r,
              name: body.name,
              description: body.description,
              fee: body.fee,
              minutes: body.minutes,
              open: body.open,
              minimum: body.minimum,
            }
          : r,
      );
    }
    result = state.settings;
  } else if (route === "products") {
    const product = {
      ...body,
      id: body.id || createId(),
      restaurant_id: "bella-massa",
    };
    const index = state.catalog.products.findIndex((p) => p.id === product.id);
    if (index < 0) state.catalog.products.push(product);
    else state.catalog.products[index] = product;
    result = product;
  } else if (route === "orders") {
    if (method === "PATCH") {
      const order = state.orders.find(
        (o) => o.id === body.id && o.restaurant_id === "bella-massa",
      );
      if (!order) throw Error("Pedido não encontrado nesta loja.");
      const allowed: Record<string, string[]> = {
        new: ["preparing", "cancelled"],
        preparing: ["ready", "cancelled"],
        ready: ["delivering"],
        delivering: ["delivered"],
        delivered: [],
        cancelled: [],
      };
      if (!allowed[order.status]?.includes(body.status))
        throw Error("Mudança de status não permitida.");
      state.orders = state.orders.map((o) =>
        o.id === body.id ? { ...o, status: body.status } : o,
      );
      result = state.orders.find((o) => o.id === body.id);
    } else if (method === "POST") {
      const items = body.items.map((item: import("@/types").CartItem) => {
        const product = state.catalog.products.find(
          (p) => p.id === item.product.id && p.active,
        );
        if (!product)
          throw Error("Um produto não está disponível. Atualize a sacola.");
        return {
          ...item,
          product,
          unitPrice: itemPrice(product, item.size, item.extras),
        };
      });
      const restaurantId = items[0].product.restaurant_id;
      if (
        items.some(
          (i: import("@/types").CartItem) =>
            i.product.restaurant_id !== restaurantId,
        )
      )
        throw Error("Escolha itens de apenas um restaurante.");
      if (restaurantId === "bella-massa" && !state.settings.open)
        throw Error("A loja está fechada no momento.");
      const fee =
        state.catalog.restaurants.find((r) => r.id === restaurantId)?.fee ?? 0;
      const summary = totals(items, fee, body.coupon);
      if (
        restaurantId === "bella-massa" &&
        summary.subtotal < state.settings.minimum
      )
        throw Error("O pedido não atingiu o valor mínimo da loja.");
      const order = {
        ...state.orders[0],
        id: createId(),
        user_id: "preview",
        restaurant_id: restaurantId,
        ...summary,
        items,
        address: body.address,
        payment: body.payment,
        status: "new" as const,
        created_at: new Date().toISOString(),
      };
      state.orders.unshift(order);
      result = order;
    } else
      result = path.includes("scope=restaurant")
        ? state.orders.filter((o) => o.restaurant_id === "bella-massa")
        : state.orders;
  } else throw Error("Esta ação não faz parte da prévia.");
  if (method !== "GET") {
    try {
      sessionStorage.setItem("eyi-preview-data-v3", JSON.stringify(state));
    } catch {}
  }
  return copy(result) as T;
}
