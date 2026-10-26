"use client";
import { useCallback, useState } from "react";
import Link from "@/components/ui/AppLink";
import { Search, ArrowRight, Plus, Leaf, ExternalLink } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { request } from "@/services/api";
import { Loading, ErrorState, Empty } from "@/components/ui/Feedback";
import { Modal } from "@/components/ui/Modal";
import { ProductEditor } from "@/components/admin/ProductEditor";
import type { FoodRecipe, FoodSearch } from "@/types/foods";
export function FoodDiscovery({
  importMode = false,
}: {
  importMode?: boolean;
}) {
  const [input, setInput] = useState("pizza");
  const [query, setQuery] = useState("pizza");
  const [selected, setSelected] = useState<FoodRecipe | null>(null);
  const [message, setMessage] = useState("");
  const loader = useCallback(
    () => request<FoodSearch>("foods?q=" + encodeURIComponent(query)),
    [query],
  );
  const { data, loading, error, reload } = useAsync(loader);
  function search(e: React.FormEvent) {
    e.preventDefault();
    const next = input.trim();
    if (next === query) void reload();
    else if (next) setQuery(next);
  }
  return (
    <section className="food-discovery">
      <div className="food-discovery-header">
        <div>
          <span className="eyebrow">
            {importMode
              ? "NOVAS IDEIAS PARA O SEU CARDÁPIO"
              : "ENCONTRE SEU PRÓXIMO SABOR"}
          </span>
          <h2>
            {importMode ? "Buscar alimentos" : "Explore pratos e ingredientes"}
          </h2>
          <p>
            {importMode
              ? "Encontre uma receita, confira os ingredientes e defina o preço antes de adicionar."
              : "Busque pizzas, massas e outros pratos para conhecer novas combinações."}
          </p>
        </div>
        <form onSubmit={search} className="food-api-search">
          <Search size={18} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            maxLength={80}
            aria-label="Buscar alimentos"
            placeholder="Ex.: pizza, frango, chocolate"
          />
          <button aria-label="Pesquisar alimentos" disabled={loading}>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
      {message && (
        <p className="food-import-message" role="status">
          {message}
        </p>
      )}
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : data?.foods.length ? (
        <>
          <div className="food-api-results">
            <span>
              {data.foods.length}{" "}
              {data.foods.length === 1
                ? "alimento encontrado"
                : "alimentos encontrados"}
            </span>
            <small>
              Receitas e fotos:{" "}
              <a
                href="https://www.themealdb.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                TheMealDB
              </a>
            </small>
          </div>
          <div className="food-api-grid">
            {data.foods.map((food) => (
              <article className="food-api-card" key={food.id}>
                <button
                  className="food-api-image"
                  onClick={() => setSelected(food)}
                  aria-label={"Ver " + food.name}
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = "1";
                        e.currentTarget.src = "/assets/pizza.jpg";
                      }
                    }}
                  />
                  <span>{food.area || food.category}</span>
                </button>
                <div className="food-api-card-body">
                  <h3>{food.name}</h3>
                  <p>{food.ingredients.slice(0, 4).join(", ")}</p>
                  <button
                    className={
                      importMode ? "btn secondary full" : "food-detail-button"
                    }
                    onClick={() => setSelected(food)}
                  >
                    {importMode ? (
                      <>
                        <Plus size={16} />
                        Adicionar ao cardápio
                      </>
                    ) : (
                      <>
                        Ver ingredientes
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <Empty
          title="Nenhum alimento encontrado"
          description="Tente pizza, chicken, pasta ou chocolate. Os nomes das receitas vêm da base internacional."
        />
      )}
      <p className="food-api-footnote">
        {importMode
          ? "A API fornece receitas, ingredientes e fotos. O preço e a disponibilidade são definidos por você."
          : "Receitas ilustrativas de uma base internacional. A disponibilidade para pedido depende do cardápio de cada restaurante."}
      </p>
      {selected && (
        <Modal
          title={importMode ? "Adicionar alimento ao cardápio" : selected.name}
          onClose={() => setSelected(null)}
        >
          <div className="modal-body">
            {importMode ? (
              <>
                <p className="muted food-import-note">
                  Revise o nome e a descrição e informe o preço de venda
                  demonstrativo.
                </p>
                <ProductEditor
                  key={selected.id}
                  product={{
                    id: "mealdb-" + selected.id,
                    restaurant_id: "bella-massa",
                    name: selected.name.slice(0, 100),
                    description: (
                      "Ingredientes: " + selected.ingredients.join(", ")
                    ).slice(0, 500),
                    image: selected.image,
                    price: 0,
                    category: selected.name.toLowerCase().includes("pizza")
                      ? "Pizzas"
                      : selected.category === "Dessert"
                        ? "Sobremesas"
                        : "Pratos",
                    active: true,
                  }}
                  onSaved={() => {
                    setMessage(
                      "Alimento adicionado ao cardápio e salvo no Neon.",
                    );
                    setSelected(null);
                  }}
                />
              </>
            ) : (
              <>
                <img
                  className="food-detail-image"
                  src={selected.image}
                  alt={selected.name}
                />
                <div className="food-detail-tags">
                  <span>{selected.category}</span>
                  <span>{selected.area}</span>
                </div>
                <h3>
                  <Leaf size={18} />
                  Ingredientes
                </h3>
                <ul className="food-ingredients">
                  {selected.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                <p className="fine-print">
                  Nome e ingredientes mantidos como publicados pela base.
                  Receita: TheMealDB.
                </p>
                <a
                  className="text-link"
                  href={"https://www.themealdb.com/meal/" + selected.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver receita na fonte
                  <ExternalLink size={13} />
                </a>
                <Link
                  className="btn full"
                  href="/buscar"
                  onClick={() => setSelected(null)}
                >
                  Explorar restaurantes
                </Link>
              </>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
