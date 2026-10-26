"use client";
import Link from "@/components/ui/AppLink";
import {
  Star,
  Heart,
  Truck,
  House,
  Flame,
  UtensilsCrossed,
} from "lucide-react";
import type { Restaurant } from "@/types";
import { money } from "@/lib/format";
import { useState, useEffect } from "react";
export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const [fav, setFav] = useState(false);
  const storageKey = () =>
    (window.location.pathname.startsWith("/previa/")
      ? "preview-fav-"
      : "fav-") + r.id;
  useEffect(() => {
    try {
      // Read browser storage after hydration; it is unavailable on the server.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFav(
        localStorage.getItem(
          (window.location.pathname.startsWith("/previa/")
            ? "preview-fav-"
            : "fav-") + r.id,
        ) === "1",
      );
    } catch {}
  }, [r.id]);
  const isPizza = r.category === "Pizza";
  const isBurger = r.category === "Hambúrguer";
  const Mark = isPizza ? House : isBurger ? Flame : UtensilsCrossed;
  const shortName = r.id === "bella-massa" ? "Bella Massa" : r.name;
  return (
    <article className="restaurant-card reference-restaurant-card">
      <Link className="restaurant-cover" href={"/loja/" + r.id}>
        <img src={r.image} alt={r.name} loading="lazy" />
      </Link>
      <button
        className={"favorite " + (fav ? "selected" : "")}
        aria-label={(fav ? "Remover dos favoritos: " : "Favoritar: ") + r.name}
        aria-pressed={fav}
        onClick={() => {
          setFav(!fav);
          try {
            localStorage.setItem(storageKey(), fav ? "0" : "1");
            window.dispatchEvent(new Event("eyi-favorites-changed"));
          } catch {}
        }}
      >
        <Heart size={23} fill={fav ? "currentColor" : "none"} />
      </button>
      <Link className="restaurant-info" href={"/loja/" + r.id}>
        <div className="restaurant-identity">
          <div
            className={
              "restaurant-monogram " +
              (isPizza ? "pizza" : isBurger ? "burger" : "sushi")
            }
            aria-hidden="true"
          >
            <Mark size={25} />
            <b>{shortName}</b>
            <small>
              {isPizza ? "PIZZARIA" : isBurger ? "ARTESANAL" : "RESTAURANTE"}
            </small>
          </div>
          <div>
            <h3>{r.name}</h3>
            <span className="rating">
              <Star size={15} fill="currentColor" />
              <span>
                {r.rating.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}
              </span>
            </span>
          </div>
        </div>
        <div className="restaurant-card-details">
          <div className="restaurant-tags">
            <span>{r.category}</span>
            <span>
              {isPizza
                ? "Italiana"
                : isBurger
                  ? "Lanches"
                  : r.category === "Japonesa"
                    ? "Sushi"
                    : "Caseira"}
            </span>
          </div>
          <span className="delivery-detail">
            <Truck size={13} />
            {r.minutes}–{r.minutes + 10} min
          </span>
          <span className={"delivery-detail " + (r.fee === 0 ? "green" : "")}>
            <Truck size={13} />
            {r.fee === 0 ? "Grátis" : money(r.fee)}
          </span>
        </div>
      </Link>
    </article>
  );
}
