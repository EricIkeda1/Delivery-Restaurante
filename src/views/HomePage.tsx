"use client";
import Link from "@/components/ui/AppLink";
import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import {
  RestaurantFilters,
  type RestaurantSort,
} from "@/components/restaurant/RestaurantFilters";
import { FoodDiscovery } from "@/components/restaurant/FoodDiscovery";
import { restaurantCategories } from "@/lib/categories";
export function HomePage() {
  const { data, loading, error, reload } = useAsync(api.catalog);
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<RestaurantSort>("recommended");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const availableCategories = restaurantCategories.filter((c) =>
    data?.restaurants.some((r) => r.category === c),
  );
  const filtered = (
    data?.restaurants.filter(
      (r) =>
        (category === "Todos" || r.category === category) &&
        (!freeDelivery || r.fee === 0),
    ) || []
  ).sort((a, b) =>
    sort === "rating"
      ? b.rating - a.rating
      : sort === "minutes"
        ? a.minutes - b.minutes
        : sort === "fee"
          ? a.fee - b.fee
          : 0,
  );
  return (
    <div className="home-reference">
      <section className="pizza-hero">
        <img
          className="pizza-hero-photo"
          src="/assets/pizza-pull-hero.webp"
          alt="Pizza artesanal com manjericão e uma fatia com queijo derretido"
          fetchPriority="high"
        />
        <div className="pizza-hero-overlay" />
        <div className="pizza-hero-copy">
          <div className="pizza-hero-kicker">
            <span>SABOR QUE CHEGA ATÉ VOCÊ</span>
            <i />
          </div>
          <h1>
            Sua próxima pizza
            <br />
            favorita está <em>aqui.</em>
          </h1>
          <p>Descubra restaurantes perto de você e peça do seu jeito.</p>
          <Link className="pizza-hero-cta" href="/buscar">
            Explorar restaurantes <ArrowRight size={21} />
          </Link>
        </div>
      </section>
      <RestaurantFilters
        categories={[...availableCategories]}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        freeDelivery={freeDelivery}
        onFreeDeliveryChange={setFreeDelivery}
      />
      <section className="home-restaurants">
        <div className="home-restaurants-heading">
          <h2>Restaurantes em Ibiporã</h2>
          <Link href="/buscar">
            Ver todos <ChevronRight size={17} />
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : filtered.length ? (
          <div className="restaurant-grid home-restaurant-grid">
            {filtered.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <Empty
            title="Esse sabor está chegando"
            description="Experimente outra categoria ou desative o filtro de entrega grátis."
          />
        )}
      </section>
      <FoodDiscovery />
    </div>
  );
}
