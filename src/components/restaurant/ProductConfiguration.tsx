import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import type { Product } from "@/types";
import { money } from "@/lib/format";
import { extraOptions, itemPrice } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";
export function ProductConfiguration({
  product: p,
  onAdded,
}: {
  product: Product;
  onAdded: () => void;
}) {
  const [size, setSize] = useState("Média");
  const [crust, setCrust] = useState("Tradicional");
  const [extras, setExtras] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { add, items } = useCart();
  const price = itemPrice(p, size, extras);
  const pizza = p.category === "Pizzas";
  return (
    <div className="product-configuration">
      <img className="modal-food" src={p.image} alt={p.name} />
      <div className="modal-body">
        <h2>{p.name}</h2>
        <p className="muted">{p.description}</p>
        {p.id.startsWith("mealdb-") && (
          <p className="fine-print">
            Receita e foto: TheMealDB · Preço demonstrativo definido pela loja.
          </p>
        )}
        <h3>{money(price)}</h3>
        {pizza && (
          <>
            <h4>
              Tamanho <small>Escolha 1 opção</small>
            </h4>
            <div className="size-options">
              {["Pequena", "Média", "Grande"].map((s, i) => (
                <button
                  key={s}
                  className={size === s ? "selected" : ""}
                  onClick={() => setSize(s)}
                >
                  {s}
                  <small>{[4, 6, 8][i]} fatias</small>
                </button>
              ))}
            </div>
            <h4>Massa</h4>
            <div className="chips">
              {["Tradicional", "Fina", "Integral"].map((s) => (
                <button
                  className={crust === s ? "active" : ""}
                  key={s}
                  onClick={() => setCrust(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <h4>
              Adicionais <small>Opcional</small>
            </h4>
            {extraOptions.map((e) => (
              <label className="check-row" key={e.name}>
                <input
                  type="checkbox"
                  checked={extras.includes(e.name)}
                  onChange={() =>
                    setExtras((prev) =>
                      prev.includes(e.name)
                        ? prev.filter((x) => x !== e.name)
                        : [...prev, e.name],
                    )
                  }
                />
                <span>{e.name}</span>
                <b>+ {money(e.price)}</b>
              </label>
            ))}
          </>
        )}
        <label className="field">
          Alguma observação?
          <textarea
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex.: tirar a cebola, por favor."
          />
        </label>
        {items.length > 0 &&
          items[0].product.restaurant_id !== p.restaurant_id && (
            <p className="fine-print">
              Ao adicionar, uma nova sacola será iniciada para este restaurante.
            </p>
          )}
        <div className="modal-bottom">
          <div className="stepper">
            <button
              aria-label="Diminuir"
              disabled={quantity <= 1}
              onClick={() => setQuantity(quantity - 1)}
            >
              <Minus size={16} />
            </button>
            <b>{quantity}</b>
            <button
              aria-label="Aumentar"
              disabled={quantity >= 20}
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            className="btn grow"
            onClick={() => {
              add({
                key: JSON.stringify([
                  p.id,
                  size,
                  crust,
                  [...extras].sort(),
                  note,
                ]),
                product: p,
                quantity,
                size,
                crust,
                extras,
                note,
                unitPrice: price,
              });
              onAdded();
            }}
          >
            Adicionar • {money(price * quantity)}
          </button>
        </div>
      </div>
    </div>
  );
}
