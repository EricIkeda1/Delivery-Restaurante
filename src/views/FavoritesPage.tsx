"use client";
import { useEffect, useState } from "react";
import Link from "@/components/ui/AppLink";
import { Heart } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
export function FavoritesPage() {
  const { data, loading, error, reload } = useAsync(api.catalog);
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    function sync() {
      if (!data) return;
      const prefix = window.location.pathname.startsWith("/previa/")
        ? "preview-fav-"
        : "fav-";
      try {
        setIds(
          data.restaurants
            .filter((r) => localStorage.getItem(prefix + r.id) === "1")
            .map((r) => r.id),
        );
      } catch {
        setIds([]);
      }
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("eyi-favorites-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("eyi-favorites-changed", sync);
    };
  }, [data]);
  const restaurants = data?.restaurants.filter((r) => ids.includes(r.id)) || [];
  return (
    <section className="section">
      <div className="favorite-heading">
        <span className="eyebrow">OS SABORES QUE VOCÊ AMA</span>
        <h1>
          Seus favoritos <Heart size={26} />
        </h1>
        <p className="muted">Seus restaurantes preferidos, sempre por perto.</p>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : restaurants.length ? (
        <div className="restaurant-grid section">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <>
          <Empty
            title="Qual restaurante ganhou seu coração?"
            description="Toque no coração dos cards para salvar seus favoritos neste dispositivo."
          />
          <Link href="/buscar" className="btn">
            Explorar restaurantes
          </Link>
        </>
      )}
    </section>
  );
}
