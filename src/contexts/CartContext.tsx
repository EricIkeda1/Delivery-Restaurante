"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { previewCart } from "@/lib/preview-data";
import type { CartItem } from "@/types";
import { addCartItem, changeCartQuantity, isCartItem } from "@/lib/cart";
const CartContext = createContext<null | {
  ready: boolean;
  items: CartItem[];
  add: (item: CartItem) => void;
  replace: (items: CartItem[]) => void;
  quantity: (key: string, delta: number) => void;
  clear: () => void;
  coupon: string;
  setCoupon: (value: string) => void;
}>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <CartStateProvider
      key={path.startsWith("/previa/") ? "preview" : "application"}
      preview={path.startsWith("/previa/")}
    >
      {children}
    </CartStateProvider>
  );
}
function CartStateProvider({
  children,
  preview,
}: {
  children: ReactNode;
  preview: boolean;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const current = useRef<CartItem[]>([]);
  const [coupon, setCouponState] = useState("");
  const storage = () => (preview ? sessionStorage : localStorage);
  const itemKey = preview ? "eyi-preview-cart-v2" : "eyi-cart";
  const couponKey = preview ? "eyi-preview-coupon" : "eyi-coupon";
  useEffect(() => {
    const savedStorage = preview ? sessionStorage : localStorage;
    try {
      const raw = savedStorage.getItem(itemKey);
      const data: unknown = raw ? JSON.parse(raw) : preview ? previewCart : [];
      const valid = Array.isArray(data) ? data.filter(isCartItem) : [];
      current.current = valid;
      // Restore the browser-only cart after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(valid);
      const code = savedStorage.getItem(couponKey);
      setCouponState(code === "PIZZA10" ? code : "");
    } catch {
      current.current = [];
      setItems([]);
    }
    setReady(true);
  }, [preview, itemKey, couponKey]);
  function commit(next: CartItem[]) {
    current.current = next;
    try {
      storage().setItem(itemKey, JSON.stringify(next));
    } catch {}
    setItems(next);
  }
  function setCoupon(value: string) {
    setCouponState(value);
    try {
      storage().setItem(couponKey, value);
    } catch {}
  }
  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        replace: (items) => commit(items.filter(isCartItem)),
        add: (item) => commit(addCartItem(current.current, item)),
        quantity: (key, delta) =>
          commit(changeCartQuantity(current.current, key, delta)),
        clear: () => {
          commit([]);
          setCoupon("");
        },
        coupon,
        setCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw Error("CartProvider ausente");
  return value;
}
