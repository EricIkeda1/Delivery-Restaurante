"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
const NavigationContext = createContext<null | {
  open: boolean;
  toggle: () => void;
  close: () => void;
}>(null);
export function NavigationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <NavigationContext.Provider
      value={{
        open,
        toggle: () => setOpen((value) => !value),
        close: () => setOpen(false),
      }}
    >
      <div className={"delivery-app " + (open ? "menu-is-open" : "")}>
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
export function useSiteMenu() {
  const context = useContext(NavigationContext);
  if (!context) throw Error("NavigationProvider ausente");
  return context;
}
