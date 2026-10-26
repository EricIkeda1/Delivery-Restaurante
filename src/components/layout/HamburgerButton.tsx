"use client";
import { useSiteMenu } from "@/contexts/NavigationContext";
export function HamburgerButton() {
  const { open, toggle } = useSiteMenu();
  return (
    <button
      type="button"
      className={"site-menu-trigger " + (open ? "is-open" : "")}
      aria-label={open ? "Fechar menu do EYI Food" : "Abrir menu do EYI Food"}
      aria-controls="site-navigation-drawer"
      aria-expanded={open}
      onClick={toggle}
    >
      <span />
      <span />
      <span />
    </button>
  );
}
