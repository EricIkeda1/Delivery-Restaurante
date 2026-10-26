import type { ReactNode } from "react";
import Link from "@/components/ui/AppLink";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Brand } from "@/components/ui/Brand";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { SiteMenu } from "./SiteMenu";
export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <NavigationProvider>
      <SiteMenu />
      <div className="delivery-surface">
        <Header />
        <main className="customer-main">{children}</main>
        <footer className="footer">
          <Brand compact />
          <span>Seu próximo sabor favorito está aqui.</span>
          <nav aria-label="Links do rodapé">
            <Link href="/restaurante">Área do restaurante</Link>
            <Link href="/interfaces">Todas as telas</Link>
          </nav>
          <small>Projeto fictício • Pedidos e pagamentos demonstrativos</small>
        </footer>
        <BottomNav />
      </div>
    </NavigationProvider>
  );
}
