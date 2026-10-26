"use client";
import { screens } from "@/lib/screens";
import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { House, Search, ReceiptText, UserRound } from "lucide-react";
export function BottomNav() {
  const currentPath = usePathname();
  const path = currentPath.startsWith("/previa/")
    ? (screens.find((s) => currentPath === "/previa/" + s.id)?.path ??
      currentPath)
    : currentPath;
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {[
        { href: "/", icon: House, label: "Início" },
        { href: "/buscar", icon: Search, label: "Buscar" },
        { href: "/pedidos", icon: ReceiptText, label: "Pedidos" },
        { href: "/perfil", icon: UserRound, label: "Perfil" },
      ].map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={path === href ? "active" : ""}
          aria-current={path === href ? "page" : undefined}
        >
          <Icon size={21} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
