import { ScrollEffects } from "@/components/layout/ScrollEffects";
import { PreviewBoundary } from "@/components/layout/PreviewBoundary";
import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/delivery.css";
import "@/styles/animations.css";
import "@/styles/theme.css";
import { CartProvider } from "@/contexts/CartContext";
export const metadata: Metadata = {
  title: "EYI Food • Seu próximo sabor favorito",
  description:
    "Os sabores de Ibiporã em um só lugar. Projeto demonstrativo de delivery de restaurantes.",
  icons: { icon: "/assets/logo.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ScrollEffects />
        <CartProvider>
          <PreviewBoundary>{children}</PreviewBoundary>
        </CartProvider>
      </body>
    </html>
  );
}
