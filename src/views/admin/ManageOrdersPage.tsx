"use client";
import Link from "@/components/ui/AppLink";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { money, statusLabels } from "@/lib/format";
import type { Order, OrderStatus } from "@/types";
const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  new: "preparing",
  preparing: "ready",
  ready: "delivering",
  delivering: "delivered",
};
export function ManageOrdersPage() {
  const { data, loading, error, reload } = useAsync(api.adminOrders);
  const [tab, setTab] = useState("all");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const t = setInterval(() => void reload(), 10000);
    return () => clearInterval(t);
  }, [reload]);
  async function update(o: Order, status: OrderStatus) {
    setBusy(true);
    try {
      await api.updateStatus(o.id, status);
      await reload();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const orders = data?.filter((o) => tab === "all" || o.status === tab) || [];
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">CADA PEDIDO IMPORTA</span>
          <h1>Pedidos</h1>
          <p>Da confirmação à última entrega.</p>
        </div>
        <span className="badge">Atualiza a cada 10 segundos</span>
      </div>
      <div className="tabs">
        {["all", "new", "preparing", "ready", "delivering", "delivered"].map(
          (s) => (
            <button
              className={tab === s ? "active" : ""}
              key={s}
              onClick={() => setTab(s)}
            >
              {s === "all" ? "Todos" : statusLabels[s]}{" "}
              <small>
                {data?.filter((o) => s === "all" || o.status === s).length || 0}
              </small>
            </button>
          ),
        )}
      </div>
      {message && <p className="form-error">{message}</p>}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : orders.length ? (
        <div className="admin-orders">
          {orders.map((o) => (
            <article className="panel" key={o.id}>
              <div className="row">
                <b>#{o.id.slice(0, 6).toUpperCase()}</b>
                <span className={"status " + o.status}>
                  {statusLabels[o.status]}
                </span>
              </div>
              <p className="muted">
                {new Date(o.created_at).toLocaleString("pt-BR")}
              </p>
              {o.items.map((i) => (
                <p key={i.key}>
                  {i.quantity}× {i.product.name}
                </p>
              ))}
              <div className="row">
                <strong>{money(o.total)}</strong>
                <Link
                  className="text-link"
                  href={"/restaurante/pedidos/" + o.id}
                >
                  Ver detalhes
                </Link>
              </div>
              {nextStatus[o.status] && (
                <button
                  disabled={busy}
                  className="btn full"
                  onClick={() => void update(o, nextStatus[o.status]!)}
                >
                  {o.status === "new"
                    ? "Aceitar pedido"
                    : statusLabels[nextStatus[o.status]!]}
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Tudo tranquilo por aqui"
          description="Não há pedidos nesta etapa."
        />
      )}
    </>
  );
}
