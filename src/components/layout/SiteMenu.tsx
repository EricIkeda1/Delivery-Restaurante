"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  House,
  UtensilsCrossed,
  LayoutGrid,
  Heart,
  Clock3,
  Ticket,
  MapPin,
  CircleHelp,
  Store,
  ArrowRight,
  ChevronsLeft,
  X,
} from "lucide-react";
import Link from "@/components/ui/AppLink";
import { Brand } from "@/components/ui/Brand";
import { useSiteMenu } from "@/contexts/NavigationContext";
import { screens } from "@/lib/screens";
const primary = [
  { href: "/", label: "Início", icon: House },
  { href: "/buscar", label: "Restaurantes", icon: UtensilsCrossed },
  { href: "/buscar#filtros", label: "Categorias", icon: LayoutGrid },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/pedidos", label: "Meus pedidos", icon: Clock3 },
  { href: "/cupons", label: "Cupons", icon: Ticket },
];
const secondary = [
  { href: "/perfil#enderecos", label: "Meus endereços", icon: MapPin },
  { href: "/ajuda", label: "Ajuda", icon: CircleHelp },
];
export function SiteMenu() {
  const { open, close } = useSiteMenu();
  const ref = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const path = usePathname();
  const route = path.startsWith("/previa/")
    ? screens.find((s) => path === "/previa/" + s.id)?.path ||
      (
        {
          "/previa/favoritos": "/favoritos",
          "/previa/cupons": "/cupons",
          "/previa/ajuda": "/ajuda",
        } as Record<string, string>
      )[path] ||
      path
    : path;
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let media: MediaQueryList | undefined;
    const previousOverflow = document.body.style.overflow;
    function restore() {
      document.body.style.overflow = previousOverflow;
    }
    function show() {
      if (!dialog) return;
      if (dialog.open) dialog.close();
      if (window.matchMedia("(max-width:1100px)").matches) {
        dialog.showModal();
        document.body.style.overflow = "hidden";
      } else {
        dialog.show();
        restore();
      }
      dialog.dataset.phase = "open";
    }
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      show();
      media = window.matchMedia("(max-width:1100px)");
      media.addEventListener("change", show);
    } else if (dialog.open) {
      dialog.dataset.phase = "closing";
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      timer = setTimeout(
        () => {
          dialog.close();
          restore();
          if (previousFocus.current?.isConnected) previousFocus.current.focus();
        },
        reduced ? 0 : 260,
      );
    }
    return () => {
      if (timer) clearTimeout(timer);
      media?.removeEventListener("change", show);
      restore();
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, close]);
  function links(items: typeof primary) {
    return items.map(({ href, label, icon: Icon }) => {
      const active =
        href === "/"
          ? route === "/"
          : href.includes("#")
            ? false
            : route === href;
      return (
        <Link
          className={"site-menu-item " + (active ? "active" : "")}
          href={href}
          onClick={close}
          key={href}
          aria-current={active ? "page" : undefined}
        >
          <Icon size={24} />
          <span>{label}</span>
        </Link>
      );
    });
  }
  return (
    <dialog
      ref={ref}
      id="site-navigation-drawer"
      className="site-navigation-drawer"
      aria-labelledby="site-menu-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          close();
      }}
    >
      <div className="site-menu-header">
        <Brand />
        <button
          className="site-menu-close"
          onClick={close}
          aria-label="Fechar menu"
        >
          <ChevronsLeft className="drawer-close-desktop" size={21} />
          <X className="drawer-close-mobile" size={21} />
        </button>
      </div>
      <h2 id="site-menu-title">Menu</h2>
      <nav className="site-menu-primary" aria-label="Menu lateral principal">
        {links(primary)}
      </nav>
      <div className="site-menu-divider" />
      <nav className="site-menu-secondary" aria-label="Endereços e ajuda">
        {links(secondary)}
      </nav>
      <section className="site-menu-restaurant">
        <span className="site-menu-store-icon">
          <Store size={29} />
        </span>
        <div>
          <h3>Tem um restaurante?</h3>
          <p>Gerencie sua loja e receba novos pedidos.</p>
        </div>
        <Link href="/restaurante">
          Acessar painel
          <ArrowRight size={17} />
        </Link>
      </section>
      <Link className="site-menu-all-screens" href="/interfaces">
        Conheça todas as telas
        <ArrowRight size={13} />
      </Link>
    </dialog>
  );
}
