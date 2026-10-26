"use client";
import { useState } from "react";
import Link from "@/components/ui/AppLink";
import { appHref, navigate } from "@/lib/screens";
import { Star, Clock, MapPin, ShoppingBag } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { ProductCard } from "@/components/restaurant/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { money } from "@/lib/format";
export function RestaurantPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.catalog);
  const [category, setCategory] = useState("Todos");
  const { items } = useCart();
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const r = data?.restaurants.find((r) => r.id === id);
  if (!r) return <ErrorState message="Restaurante não encontrado." />;
  const products = data!.products.filter(
    (p) => p.restaurant_id === id && p.active,
  );
  const cats = ["Todos", ...new Set(products.map((p) => p.category))];
  return (
    <>
      <div className="breadcrumbs">
        <Link href="/">Início</Link> / <span>{r.name}</span>
      </div>
      <section className="restaurant-banner">
        <img src={r.image} alt={r.name} />
        <span>FEITO À MÃO. PEDIDO COM AMOR.</span>
      </section>
      <div className="store-heading">
        <div className="store-avatar">
          {r.category === "Pizza"
            ? "🍕"
            : r.category === "Japonesa"
              ? "🍣"
              : "🍔"}
        </div>
        <div className="grow">
          <span className="eyebrow">SEU NOVO FAVORITO</span>
          <h1>{r.name}</h1>
          <div className="store-meta">
            <span className="rating">
              <Star size={15} fill="currentColor" />
              {r.rating} (120 avaliações)
            </span>
            <span>
              <Clock size={15} />
              {r.minutes}–{r.minutes + 10} min
            </span>
            <span>
              <MapPin size={15} />
              Ibiporã • {r.fee ? money(r.fee) : "Entrega grátis"}
            </span>
          </div>
        </div>
        <span className="badge">
          {r.open === false ? "Fechado no momento" : "Aberto agora"}
        </span>
      </div>
      <div className="menu-layout">
        <aside className="menu-sidebar">
          <h4>Cardápio</h4>
          {cats.map((c) => (
            <button
              className={category === c ? "active" : ""}
              key={c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </aside>
        <section className="menu-content">
          <div className="section-head">
            <div>
              <h2>
                {category === "Todos" ? "Mais pedidos por aqui" : category}
              </h2>
              <p>Ingredientes selecionados. Sabor que faz diferença.</p>
            </div>
          </div>
          <div className="product-grid">
            {products
              .filter((p) => category === "Todos" || p.category === category)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  disabled={r.open === false}
                  onSelect={(p) => navigate(appHref("/produto/" + p.id))}
                />
              ))}
          </div>
          <div className="store-note">
            <Clock size={20} />
            <div>
              <b>Um bom sabor tem seu tempo.</b>
              <p>
                Os pedidos são preparados na hora. Tempo estimado: {r.minutes}–
                {r.minutes + 10} minutos.
              </p>
            </div>
          </div>
        </section>
      </div>
      {items.length > 0 && (
        <Link href="/carrinho" className="floating-cart">
          <ShoppingBag size={20} />
          <span>
            Ver sacola • {items.reduce((n, i) => n + i.quantity, 0)} itens
          </span>
          <strong>
            {money(items.reduce((n, i) => n + i.quantity * i.unitPrice, 0))}
          </strong>
        </Link>
      )}
    </>
  );
}
