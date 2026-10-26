import type { Catalog, Order, Profile, StoreSettings, Product } from "@/types";
export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/previa/") &&
    !path.startsWith("foods")
  ) {
    const { previewRequest } = await import("./preview");
    return previewRequest<T>(path, options);
  }
  const res = await fetch("/api/" + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok)
    throw Error(data.error || "Não foi possível concluir. Tente novamente.");
  return data;
}
export const api = {
  catalog: () => request<Catalog>("catalog"),
  orders: () => request<Order[]>("orders"),
  adminOrders: () => request<Order[]>("orders?scope=restaurant"),
  profile: () => request<Profile>("profile"),
  saveProfile: (data: Profile) =>
    request<Profile>("profile", { method: "PUT", body: JSON.stringify(data) }),
  settings: () => request<StoreSettings>("settings"),
  saveSettings: (data: StoreSettings) =>
    request<StoreSettings>("settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  saveProduct: (data: Partial<Product>) =>
    request<Product>("products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: string) =>
    request<Order>("orders", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    }),
};
