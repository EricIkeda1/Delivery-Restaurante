import { Truck, ChevronDown } from "lucide-react";
export type RestaurantSort = "recommended" | "rating" | "minutes" | "fee";
type Props = {
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
  sort: RestaurantSort;
  onSortChange: (sort: RestaurantSort) => void;
  freeDelivery: boolean;
  onFreeDeliveryChange: (enabled: boolean) => void;
};
export function RestaurantFilters({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  freeDelivery,
  onFreeDeliveryChange,
}: Props) {
  return (
    <section className="restaurant-filterbar" aria-label="Filtrar restaurantes">
      <div
        className="restaurant-category-tabs"
        role="group"
        aria-label="Tipo de culinária"
      >
        {["Todos", ...categories].map((name) => (
          <button
            type="button"
            key={name}
            className={category === name ? "selected" : ""}
            aria-pressed={category === name}
            onClick={() => onCategoryChange(name)}
          >
            {name === "Todos" ? "Todos os restaurantes" : name}
          </button>
        ))}
      </div>
      <div className="restaurant-filter-options">
        <button
          type="button"
          className={"delivery-filter " + (freeDelivery ? "selected" : "")}
          aria-pressed={freeDelivery}
          onClick={() => onFreeDeliveryChange(!freeDelivery)}
        >
          <Truck size={16} />
          <span>Entrega grátis</span>
        </button>
        <label className="restaurant-sort">
          <span className="sr-only">Ordenar restaurantes</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as RestaurantSort)}
          >
            <option value="recommended">Recomendados</option>
            <option value="rating">Melhor avaliação</option>
            <option value="minutes">Mais rápidos</option>
            <option value="fee">Menor entrega</option>
          </select>
          <ChevronDown size={14} aria-hidden="true" />
        </label>
      </div>
    </section>
  );
}
