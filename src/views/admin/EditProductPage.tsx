"use client";
import Link from "@/components/ui/AppLink";
import { ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { appHref, navigate } from "@/lib/screens";
import type { Product } from "@/types";
const blank: Partial<Product> = {
  name: "",
  description: "",
  price: 49.9,
  restaurant_id: "bella-massa",
  category: "Pizzas",
  image: "/assets/pizza.jpg",
  active: true,
};
export function EditProductPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.catalog);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const product =
    id === "novo"
      ? blank
      : data?.products.find(
          (p) => p.id === id && p.restaurant_id === "bella-massa",
        );
  if (!product) return <ErrorState message="Produto não encontrado." />;
  return (
    <>
      <Link href="/restaurante/cardapio" className="back-link">
        <ArrowLeft size={16} />
        Voltar ao cardápio
      </Link>
      <span className="eyebrow">CADA DETALHE ABRE O APETITE</span>
      <h1>{id === "novo" ? "Adicionar produto" : "Editar produto"}</h1>
      <p className="muted">
        Deixe seu prato tão bonito no cardápio quanto na mesa.
      </p>
      <div className="editor-page-grid">
        <section className="panel">
          <ProductEditor
            product={product}
            onSaved={() => navigate(appHref("/restaurante/cardapio"))}
          />
        </section>
        <aside className="panel editor-tips">
          <img src={product.image} alt={product.name || "Prévia do produto"} />
          <h3>Uma boa apresentação faz diferença.</h3>
          <p>
            Use um nome fácil de reconhecer e descreva os ingredientes
            principais.
          </p>
          <ul>
            <li>Mantenha preço e categoria atualizados.</li>
            <li>Pause o produto quando não estiver disponível.</li>
            <li>Confira o resultado no cardápio do cliente.</li>
          </ul>
          <Link className="text-link" href="/loja/bella-massa">
            Ver minha loja
          </Link>
        </aside>
      </div>
    </>
  );
}
