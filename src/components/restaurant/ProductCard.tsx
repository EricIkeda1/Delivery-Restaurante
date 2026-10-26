import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { money } from "@/lib/format";
export function ProductCard({
  product: p,
  onSelect,
  disabled = false,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="product-card"
      disabled={disabled}
      onClick={() => onSelect(p)}
    >
      <div>
        <span className="eyebrow">Feito com carinho</span>
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <strong>{money(p.price)}</strong>
      </div>
      <div className="product-image">
        <img src={p.image} alt={p.name} />
        <span>
          <Plus size={18} />
        </span>
      </div>
    </button>
  );
}
