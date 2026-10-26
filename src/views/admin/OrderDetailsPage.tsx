"use client";
import Link from "@/components/ui/AppLink";
import { useState } from "react";
import { ArrowLeft, UserRound, MapPin, ReceiptText, Clock } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { money, statusLabels } from "@/lib/format";
import type { OrderStatus } from "@/types";
const next: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "preparing",
  preparing: "ready",
  ready: "delivering",
  delivering: "delivered",
};
export function OrderDetailsPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.adminOrders);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const order = data?.find((o) => o.id === id);
  async function update(status: OrderStatus) {
    setBusy(true);
    try {
      await api.updateStatus(id, status);
      await reload();
      setMessage("Pedido atualizado.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  if (!order) return <ErrorState message="Pedido não encontrado." />;
  return (
    <>
      <Link className="back-link" href="/restaurante/pedidos">
        <ArrowLeft size={16} />
        Voltar aos pedidos
      </Link>
      <div className="section-head">
        <div>
          <span className="eyebrow">UMA BOA ENTREGA COMEÇA AQUI</span>
          <h1>Pedido #{order.id.slice(0, 6).toUpperCase()}</h1>
          <p>
            <Clock size={13} />{" "}
            {new Date(order.created_at).toLocaleString("pt-BR")}
          </p>
        </div>
        <span className={"status " + order.status}>
          {statusLabels[order.status]}
        </span>
      </div>
      <div className="order-detail-grid">
        <div className="stack">
          <section className="panel">
            <h3>
              <ReceiptText />
              Itens do pedido
            </h3>
            {order.items.map((i) => (
              <div className="detail-item" key={i.key}>
                <img src={i.product.image} alt={i.product.name} />
                <div className="grow">
                  <h3>
                    {i.quantity}× {i.product.name}
                  </h3>
                  <p>
                    {i.size} • Massa {i.crust.toLowerCase()}
                  </p>
                  {i.extras.length > 0 && <p>{i.extras.join(", ")}</p>}
                  {i.note && (
                    <div className="item-note">Observação: {i.note}</div>
                  )}
                </div>
                <strong>{money(i.unitPrice * i.quantity)}</strong>
              </div>
            ))}
            <OrderSummary
              subtotal={order.subtotal}
              discount={order.discount}
              fee={order.fee}
              total={order.total}
            />
          </section>
          <div className="panel">
            <h3>
              <MapPin />
              Endereço de entrega
            </h3>
            <p>{order.address}</p>
            <p className="fine-print">
              Confira o endereço antes de marcar a saída para entrega.
            </p>
          </div>
        </div>
        <aside className="stack">
          <section className="panel">
            <h3>
              <UserRound />
              Informações do pedido
            </h3>
            <div className="detail-info">
              <span>Restaurante</span>
              <b>Pizzaria Bella Massa</b>
              <span>Pagamento demonstrativo</span>
              <b>{order.payment}</b>
              <span>Status atual</span>
              <b>{statusLabels[order.status]}</b>
            </div>
            {next[order.status] && (
              <button
                className="btn full"
                disabled={busy}
                onClick={() => void update(next[order.status]!)}
              >
                {busy
                  ? "Atualizando…"
                  : order.status === "new"
                    ? "Aceitar pedido"
                    : "Marcar como " + statusLabels[next[order.status]!]}
              </button>
            )}
            {["new", "preparing"].includes(order.status) && (
              <button
                className="btn danger full"
                disabled={busy}
                onClick={() => void update("cancelled")}
              >
                Cancelar pedido
              </button>
            )}
            {message && (
              <p role="status" className="form-message">
                {message}
              </p>
            )}
          </section>
          <div className="order-help">
            <span>🍕</span>
            <h3>
              Um cuidado a mais.
              <br />
              Um cliente mais feliz.
            </h3>
            <p>
              Confira os adicionais e as observações antes de enviar para a
              cozinha.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
