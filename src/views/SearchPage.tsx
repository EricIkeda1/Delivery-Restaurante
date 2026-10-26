"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { restaurantCategories } from "@/lib/categories";
export function SearchPage() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState("Todos");
  const [free, setFree] = useState(false);
  const [sort, setSort] = useState("rating");
  const { data, loading, error, reload } = useAsync(api.catalog);
  const results =
    data?.restaurants
      .filter(
        (r) =>
          (category === "Todos" || category === r.category) &&
          (!free || r.fee === 0) &&
          ((r.name + " " + r.description + " " + r.category)
            .toLowerCase()
            .includes(q.toLowerCase()) ||
            data.products.some(
              (p) =>
                p.restaurant_id === r.id &&
                p.name.toLowerCase().includes(q.toLowerCase()),
            )),
      )
      .sort((a, b) =>
        sort === "minutes"
          ? a.minutes - b.minutes
          : sort === "fee"
            ? a.fee - b.fee
            : b.rating - a.rating,
      ) || [];
  return (
    <section className="section">
      <span className="eyebrow">ENCONTRE SUA BOA PEDIDA</span>
      <h1>O que vamos pedir hoje?</h1>
      <div className="search large">
        <Search />
        <input
          aria-label="Buscar"
          placeholder="Restaurante, prato ou cozinha"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="filters" id="filtros">
        <SlidersHorizontal size={18} />
        <select
          aria-label="Ordenar"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="rating">Melhor avaliação</option>
          <option value="minutes">Mais rápidos</option>
          <option value="fee">Menor entrega</option>
        </select>
        <select
          aria-label="Culinária"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["Todos", ...restaurantCategories].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          className={"chip " + (free ? "active" : "")}
          onClick={() => setFree(!free)}
        >
          Entrega grátis
        </button>
        <span className="muted">{results.length} restaurantes</span>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : results.length ? (
        <div className="restaurant-grid">
          {results.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum restaurante encontrado"
          description="Tente outro termo ou ajuste os filtros."
        />
      )}
    </section>
  );
}
