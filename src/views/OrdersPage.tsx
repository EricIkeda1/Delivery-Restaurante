"use client";
import { useCart } from "@/contexts/CartContext";
import { itemPrice } from "@/lib/cart";
import { navigate } from "@/lib/screens";
import type { Order } from "@/types";
import { useState } from "react";
import Link from "@/components/ui/AppLink";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { OrderCard } from "@/components/orders/OrderCard";
export function OrdersPage() {
  const { data, loading, error, reload } = useAsync(api.orders);
  const [tab, setTab] = useState("current");
  const { replace } = useCart();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  async function repeat(order: Order) {
    setBusy(order.id);
    setMessage("");
    try {
      const catalog = await api.catalog();
      const items = order.items.map((item) => {
        const product = catalog.products.find(
          (p) => p.id === item.product.id && p.active,
        );
        if (!product)
          throw Error(
            "Um dos produtos não está disponível. Escolha um novo pedido no cardápio.",
          );
        return {
          ...item,
          product,
          unitPrice: itemPrice(product, item.size, item.extras),
        };
      });
      replace(items);
      navigate("/carrinho");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  const list =
    data?.filter((o) =>
      tab === "current"
        ? !["delivered", "cancelled"].includes(o.status)
        : ["delivered", "cancelled"].includes(o.status),
    ) || [];
  return (
    <section className="section narrow">
      <span className="eyebrow">CADA PEDIDO, UMA BOA HISTÓRIA</span>
      <h1>Meus pedidos</h1>
      <div className="tabs">
        <button
          className={tab === "current" ? "active" : ""}
          onClick={() => setTab("current")}
        >
          Em andamento
        </button>
        <button
          className={tab === "past" ? "active" : ""}
          onClick={() => setTab("past")}
        >
          Concluídos
        </button>
      </div>
      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : list.length ? (
        <div className="stack">
          {list.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onRepeat={
                o.status === "delivered" ? () => void repeat(o) : undefined
              }
              busy={busy === o.id}
            />
          ))}
        </div>
      ) : (
        <>
          <Empty
            title="Nenhum pedido por aqui ainda"
            description="Seu próximo sabor favorito está a poucos cliques."
          />
          <Link className="btn" href="/">
            Escolher restaurante
          </Link>
        </>
      )}
    </section>
  );
}
