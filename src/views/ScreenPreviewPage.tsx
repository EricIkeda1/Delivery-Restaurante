"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AuthPage } from "./AuthPage";
import { HomePage } from "./HomePage";
import { SearchPage } from "./SearchPage";
import { RestaurantPage } from "./RestaurantPage";
import { ProductPage } from "./ProductPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";
import { ConfirmationPage } from "./ConfirmationPage";
import { TrackingPage } from "./TrackingPage";
import { OrdersPage } from "./OrdersPage";
import { ProfilePage } from "./ProfilePage";
import { DashboardPage } from "./admin/DashboardPage";
import { ManageOrdersPage } from "./admin/ManageOrdersPage";
import { OrderDetailsPage } from "./admin/OrderDetailsPage";
import { MenuPage } from "./admin/MenuPage";
import { EditProductPage } from "./admin/EditProductPage";
import { FinancePage } from "./admin/FinancePage";
import { FavoritesPage } from "./FavoritesPage";
import { CouponsPage } from "./CouponsPage";
import { HelpPage } from "./HelpPage";
import { FoodImportPage } from "./admin/FoodImportPage";
import { SettingsPage } from "./admin/SettingsPage";
import { previewOrder } from "@/lib/preview-data";
import { Loading } from "@/components/ui/Feedback";
import { screens } from "@/lib/screens";
export function ScreenPreviewPage({ screen }: { screen: string }) {
  const params = useSearchParams();
  const entityId = params.get("id");
  const definition = screens.find((s) => s.id === screen);
  let view: React.ReactNode;
  switch (screen) {
    case "entrar":
    case "cadastro":
    case "recuperar-senha":
      view = <AuthPage />;
      break;
    case "favoritos":
      view = <FavoritesPage />;
      break;
    case "cupons":
      view = <CouponsPage />;
      break;
    case "ajuda":
      view = <HelpPage />;
      break;
    case "inicio":
      view = <HomePage />;
      break;
    case "buscar":
      view = <SearchPage />;
      break;
    case "cardapio":
      view = <RestaurantPage id={entityId || "bella-massa"} />;
      break;
    case "produto":
      view = <ProductPage id={entityId || "calabresa"} />;
      break;
    case "carrinho":
      view = <CartPage />;
      break;
    case "checkout":
      view = <CheckoutPage />;
      break;
    case "confirmado":
      view = <ConfirmationPage id={entityId || previewOrder.id} />;
      break;
    case "acompanhar":
      view = <TrackingPage id={entityId || previewOrder.id} />;
      break;
    case "pedidos":
      view = <OrdersPage />;
      break;
    case "perfil":
      view = <ProfilePage />;
      break;
    case "alimentos":
      view = <FoodImportPage />;
      break;
    case "painel":
      view = <DashboardPage />;
      break;
    case "gerenciar-pedidos":
      view = <ManageOrdersPage />;
      break;
    case "detalhes-pedido":
      view = <OrderDetailsPage id={entityId || previewOrder.id} />;
      break;
    case "gerenciar-cardapio":
      view = <MenuPage />;
      break;
    case "editar-produto":
      view = <EditProductPage id={entityId || "calabresa"} />;
      break;
    case "financeiro":
      view = <FinancePage />;
      break;
    case "configuracoes":
      view = <SettingsPage />;
      break;
    default:
      return (
        <div className="empty">
          <h1>Tela não encontrada</h1>
          <a href="/interfaces">Ver todas as telas</a>
        </div>
      );
  }
  const content = <Suspense fallback={<Loading />}>{view}</Suspense>;
  if (["entrar", "cadastro", "recuperar-senha"].includes(screen))
    return content;
  return definition?.group === "Restaurante" || screen === "alimentos" ? (
    <AdminLayout>{content}</AdminLayout>
  ) : (
    <CustomerLayout>{content}</CustomerLayout>
  );
}
