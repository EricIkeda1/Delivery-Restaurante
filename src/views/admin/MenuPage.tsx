"use client";
import Link from "@/components/ui/AppLink";
import { useState } from "react";
import { Plus, Pencil, Search } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { money } from "@/lib/format";
export function MenuPage() {
  const { data, loading, error, reload } = useAsync(api.catalog);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const products =
    data?.products.filter(
      (p) =>
        p.restaurant_id === "bella-massa" &&
        (category === "Todos" || p.category === category) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
    ) || [];
  return (
    <>
      <div className="section-head">
        <div>
          <span className="eyebrow">SABOR BEM APRESENTADO</span>
          <h1>Cardápio</h1>
          <p>Seus pratos, sempre no ponto.</p>
        </div>
        <div className="menu-header-actions">
          <Link className="btn secondary" href="/restaurante/alimentos">
            Buscar alimentos
          </Link>
          <Link className="btn" href="/restaurante/cardapio/novo/editar">
            <Plus size={17} />
            Adicionar produto
          </Link>
        </div>
      </div>
      <div className="menu-tools">
        <div className="tabs">
          {[
            "Todos",
            "Pizzas",
            "Pratos",
            "Lanches",
            "Combinados",
            "Bebidas",
            "Sobremesas",
          ].map((c) => (
            <button
              key={c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="search">
          <Search size={17} />
          <input
            aria-label="Buscar produto no cardápio"
            placeholder="Buscar produto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : products.length ? (
        <div className="panel">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Disponibilidade</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product">
                        <img src={p.image} alt="" />
                        <span>
                          <b>{p.name}</b>
                          <small>{p.description}</small>
                        </span>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{money(p.price)}</td>
                    <td>
                      <span
                        className={
                          "status " + (p.active ? "delivered" : "cancelled")
                        }
                      >
                        {p.active ? "Ativo" : "Pausado"}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="icon-btn"
                        aria-label={"Editar " + p.name}
                        href={"/restaurante/cardapio/" + p.id + "/editar"}
                      >
                        <Pencil size={17} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-menu-list">
            {products.map((p) => (
              <Link
                key={p.id}
                href={"/restaurante/cardapio/" + p.id + "/editar"}
              >
                <img src={p.image} alt="" />
                <div className="grow">
                  <h3>{p.name}</h3>
                  <p>{money(p.price)}</p>
                  <span
                    className={
                      "status " + (p.active ? "delivered" : "cancelled")
                    }
                  >
                    {p.active ? "Ativo" : "Pausado"}
                  </span>
                </div>
                <Pencil size={16} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Empty
          title="Nenhum produto nesta categoria"
          description="Adicione um produto ou ajuste sua busca."
        />
      )}
    </>
  );
}
