"use client";
import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { HamburgerButton } from "./HamburgerButton";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { screens, previewHref } from "@/lib/screens";
export function Header() {
  const { items } = useCart();
  const [query, setQuery] = useState("");
  const current = usePathname();
  const path = current.startsWith("/previa/")
    ? (screens.find((s) => current === "/previa/" + s.id)?.path ?? current)
    : current;
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const links = [
    { href: "/", label: "Início" },
    { href: "/buscar", label: "Restaurantes" },
    { href: "/pedidos", label: "Pedidos" },
  ];
  return (
    <>
      <header className="header reference-header">
        <div className="header-inner">
          <HamburgerButton />
          <Brand />
          <Link
            className="delivery-address"
            href="/perfil"
            aria-label="Escolher endereço de entrega"
          >
            <MapPin size={25} fill="currentColor" />
            <span>
              Entregar em <b>Ibiporã</b>
            </span>
            <ChevronDown size={15} />
          </Link>
          <form
            className="search reference-search"
            action={
              current.startsWith("/previa/")
                ? previewHref("/buscar")
                : "/buscar"
            }
          >
            <Search size={21} />
            <input
              aria-label="Buscar restaurantes ou pratos"
              name="q"
              placeholder="Busque restaurantes ou pratos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-submit" aria-label="Buscar">
              <ArrowRight size={17} />
            </button>
          </form>
          <nav className="desktop-navigation" aria-label="Menu principal">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={path === l.href ? "active" : ""}
                aria-current={path === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            className="cart-link"
            href="/carrinho"
            aria-label={"Carrinho com " + count + " itens"}
          >
            <ShoppingCart size={28} />
            {count > 0 && <span>{count}</span>}
          </Link>
          <Link
            className="header-profile"
            href="/perfil"
            aria-label="Meu perfil"
          >
            <UserRound size={21} fill="currentColor" />
          </Link>
        </div>
      </header>
    </>
  );
}
