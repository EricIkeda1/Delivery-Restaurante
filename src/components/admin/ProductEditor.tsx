"use client";
import { useState } from "react";
import { api } from "@/services/api";
import type { Product } from "@/types";
export function ProductEditor({
  product,
  onSaved,
}: {
  product: Partial<Product>;
  onSaved: () => void;
}) {
  const [edit, setEdit] = useState(product);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.saveProduct(edit);
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      {" "}
      <form className="product-editor-form" onSubmit={submit}>
        <img className="edit-preview" src={edit.image} alt="Prévia" />
        <label className="field">
          Nome
          <input
            required
            maxLength={100}
            value={edit.name}
            onChange={(e) => setEdit({ ...edit, name: e.target.value })}
          />
        </label>
        <label className="field">
          Descrição
          <textarea
            required
            maxLength={500}
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
          />
        </label>
        <div className="form-grid">
          <label className="field">
            Preço definido pela loja (R$)
            <input
              required
              type="number"
              min="1"
              max="9999"
              step="0.01"
              value={edit.price}
              onChange={(e) =>
                setEdit({ ...edit, price: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            Categoria
            <select
              value={edit.category}
              onChange={(e) => setEdit({ ...edit, category: e.target.value })}
            >
              {[
                "Pizzas",
                "Pratos",
                "Lanches",
                "Combinados",
                "Bebidas",
                "Sobremesas",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          Imagem
          <select
            value={edit.image}
            onChange={(e) => setEdit({ ...edit, image: e.target.value })}
          >
            {edit.image?.startsWith("https://") && (
              <option value={edit.image}>Foto do alimento · TheMealDB</option>
            )}
            <option value="/assets/pizza.jpg">Pizza artesanal</option>
            <option value="/assets/hero.jpg">Pizza da casa</option>
            <option value="/assets/burger.jpg">Hambúrguer</option>
            <option value="/assets/sushi.jpg">Comida japonesa</option>
          </select>
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={edit.active}
            onChange={(e) => setEdit({ ...edit, active: e.target.checked })}
          />
          Disponível para pedidos
        </label>
        <button className="btn full" disabled={busy}>
          {busy ? "Salvando…" : "Salvar produto"}
        </button>
      </form>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
