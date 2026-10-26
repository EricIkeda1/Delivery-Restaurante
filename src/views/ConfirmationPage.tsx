"use client";
import Link from "@/components/ui/AppLink";
import { Check, Clock, Utensils } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/services/api";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { money } from "@/lib/format";
export function ConfirmationPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.orders);
  const { data: catalog } = useAsync(api.catalog);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const order = data?.find((o) => o.id === id);
  if (!order) return <ErrorState message="Pedido não encontrado." />;
  const restaurant = catalog?.restaurants.find(
    (r) => r.id === order.restaurant_id,
  );
  return (
    <section className="confirmation-page">
      <div className="confirmation-art">
        <img src="/assets/pizza.jpg" alt="Pizza artesanal" />
        <div>
          <Utensils size={32} />
          <h2>
            Boa comida.
            <br />
            Bons momentos.
          </h2>
          <p>A cozinha já está cuidando do seu.</p>
        </div>
      </div>
      <div className="confirmation-content">
        <span className="confirmation-check">
          <Check size={42} />
        </span>
        <span className="eyebrow">PODE DEIXAR COM A GENTE</span>
        <h1>Pedido confirmado!</h1>
        <p>
          Seu momento mais gostoso do dia
          <br />
          já começou a ser preparado.
        </p>
        <div className="confirmation-ticket">
          <b>Pedido #{order.id.slice(0, 6).toUpperCase()}</b>
          <span>{restaurant?.name || "Restaurante do pedido"}</span>
          <strong>{money(order.total)}</strong>
          <div>
            <Clock size={17} />
            <span>
              Previsão de entrega{" "}
              <b>
                {restaurant
                  ? `${restaurant.minutes}–${restaurant.minutes + 10} min`
                  : "Conforme o restaurante"}
              </b>
            </span>
          </div>
        </div>
        <Link className="btn full" href={"/pedido/" + order.id}>
          Acompanhar meu pedido
        </Link>
        <Link className="btn secondary full" href="/">
          Voltar para o início
        </Link>
        <small>Pedido demonstrativo • Nenhum valor foi cobrado.</small>
      </div>
    </section>
  );
}
