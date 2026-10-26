"use client";
import type { ReactNode } from "react";
import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  UtensilsCrossed,
  Wallet,
  Settings,
  ArrowUpRight,
  PanelLeftClose,
} from "lucide-react";
import { Brand } from "@/components/ui/Brand";
import { useState } from "react";
import { screens } from "@/lib/screens";
const nav = [
  { href: "/restaurante", label: "Visão geral", icon: LayoutDashboard },
  { href: "/restaurante/pedidos", label: "Pedidos", icon: ReceiptText },
  { href: "/restaurante/cardapio", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/restaurante/financeiro", label: "Financeiro", icon: Wallet },
  {
    href: "/restaurante/configuracoes",
    label: "Configurações",
    icon: Settings,
  },
];
export function AdminLayout({ children }: { children: ReactNode }) {
  const currentPath = usePathname();
  const path = currentPath.startsWith("/previa/")
    ? (screens.find((s) => currentPath === "/previa/" + s.id)?.path ??
      currentPath)
    : currentPath;
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-shell">
      <aside className={"admin-sidebar " + (open ? "expanded" : "")}>
        <Brand compact />
        <span className="sidebar-label">ÁREA DO RESTAURANTE</span>
        <nav>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className={
                path === href ||
                (href !== "/restaurante" && path.startsWith(href + "/"))
                  ? "active"
                  : ""
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/interfaces">Todas as telas</Link>
          <div className="demo-badge">PROJETO DEMONSTRATIVO</div>
          <Link href="/">
            <ArrowUpRight size={18} />
            Ir para o delivery
          </Link>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <button
            className="icon-btn mobile-only"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            <PanelLeftClose />
          </button>
          <span>Painel do restaurante</span>
          <Link href="/loja/bella-massa">
            🍕 Pizzaria Bella Massa <ArrowUpRight size={16} />
          </Link>
        </header>
        <main className="admin-main">{children}</main>
      </div>
      <nav className="admin-bottom-nav">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className={
              path === href ||
              (href !== "/restaurante" && path.startsWith(href + "/"))
                ? "active"
                : ""
            }
          >
            <Icon size={20} />
            <small>{label}</small>
          </Link>
        ))}
      </nav>
    </div>
  );
}
