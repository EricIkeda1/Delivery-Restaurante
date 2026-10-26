"use client";
import { useEffect } from "react";
import Link from "@/components/ui/AppLink";
import { useSearchParams } from "next/navigation";
import { Check, ChefHat, Bike, MapPin, PackageCheck } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { statusLabels } from "@/lib/format";
const stages = [
  {
    status: "new",
    title: "Pedido confirmado",
    detail: "A cozinha já recebeu seu pedido.",
    icon: Check,
  },
  {
    status: "preparing",
    title: "Em preparo",
    detail: "Cada detalhe feito com carinho.",
    icon: ChefHat,
  },
  {
    status: "ready",
    title: "Pronto para sair",
    detail: "Tudo embalado e quentinho.",
    icon: PackageCheck,
  },
  {
    status: "delivering",
    title: "Saiu para entrega",
    detail: "Seu pedido está a caminho.",
    icon: Bike,
  },
  {
    status: "delivered",
    title: "Entregue",
    detail: "Agora é só aproveitar. Bom apetite!",
    icon: MapPin,
  },
];
export function TrackingPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.orders);
  const params = useSearchParams();
  useEffect(() => {
    const timer = setInterval(() => void reload(), 10000);
    return () => clearInterval(timer);
  }, [reload]);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const o = data?.find((x) => x.id === id);
  if (!o) return <ErrorState message="Pedido não encontrado." />;
  const stage = stages.findIndex((s) => s.status === o.status);
  return (
    <section className="section narrow">
      {params.has("confirmado") && (
        <div className="confirmed">
          <span>
            <Check size={28} />
          </span>
          <div>
            <h2>Pedido confirmado!</h2>
            <p>Uma boa escolha. Agora é com a cozinha.</p>
          </div>
        </div>
      )}
      <span className="eyebrow">ACOMPANHE CADA ETAPA</span>
      <h1>Pedido #{o.id.slice(0, 6).toUpperCase()}</h1>
      <div className="checkout-grid">
        <div className="panel">
          <div className="row">
            <h3>{statusLabels[o.status]}</h3>
            <span className="badge">Atualização automática</span>
          </div>
          {o.status === "cancelled" ? (
            <p>Este pedido foi cancelado.</p>
          ) : (
            <div className="timeline">
              {stages.map((s, i) => (
                <div key={s.status} className={i <= stage ? "done" : ""}>
                  <span>
                    <s.icon size={19} />
                  </span>
                  <div>
                    <b>{s.title}</b>
                    <p>{s.detail}</p>
                  </div>
                  {i <= stage && <Check size={15} />}
                </div>
              ))}
            </div>
          )}
          <div className="delivery-box">
            <MapPin />
            <div>
              <b>Endereço de entrega</b>
              <p>{o.address}</p>
            </div>
          </div>
          <p className="fine-print">
            Acompanhamento por status do restaurante. Este projeto não utiliza
            GPS em tempo real.
          </p>
        </div>
        <aside className="panel">
          <h3>Resumo do pedido</h3>
          {o.items.map((i) => (
            <div className="mini-line" key={i.key}>
              <img src={i.product.image} alt="" />
              <span>
                <b>
                  {i.quantity}× {i.product.name}
                </b>
                <small>
                  {i.size} • {i.crust}
                </small>
              </span>
            </div>
          ))}
          <OrderSummary
            subtotal={o.subtotal}
            discount={o.discount}
            fee={o.fee}
            total={o.total}
          />
          <Link className="btn secondary full" href="/pedidos">
            Ver meus pedidos
          </Link>
        </aside>
      </div>
    </section>
  );
}
