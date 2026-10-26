import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { money } from "@/lib/format";
import { useCart } from "@/contexts/CartContext";
export function CartLine({ item: i }: { item: CartItem }) {
  const { quantity } = useCart();
  return (
    <div className="cart-line">
      <img src={i.product.image} alt={i.product.name} />
      <div className="grow">
        <h4>{i.product.name}</h4>
        <p>
          {i.size} • {i.crust}
          {i.extras.length > 0 && " • " + i.extras.join(", ")}
        </p>
        {i.note && <small>{i.note}</small>}
        <strong>{money(i.unitPrice * i.quantity)}</strong>
      </div>
      <div className="stepper">
        <button
          aria-label={"Remover um " + i.product.name}
          onClick={() => quantity(i.key, -1)}
        >
          {i.quantity === 1 ? <Trash2 size={15} /> : <Minus size={15} />}
        </button>
        <b>{i.quantity}</b>
        <button
          aria-label={"Adicionar um " + i.product.name}
          disabled={i.quantity >= 20}
          onClick={() => quantity(i.key, 1)}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
