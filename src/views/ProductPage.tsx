"use client";
import Link from "@/components/ui/AppLink";
import { ArrowLeft, Leaf, Flame, Clock } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/services/api";
import { Loading, ErrorState } from "@/components/ui/Feedback";
import { ProductConfiguration } from "@/components/restaurant/ProductConfiguration";
import { appHref, navigate } from "@/lib/screens";
export function ProductPage({ id }: { id: string }) {
  const { data, loading, error, reload } = useAsync(api.catalog);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} retry={reload} />;
  const p = data?.products.find((p) => p.id === id);
  if (!p) return <ErrorState message="Produto não encontrado." />;
  return (
    <section className="section">
      <Link className="back-link" href={"/loja/" + p.restaurant_id}>
        <ArrowLeft size={16} />
        Voltar ao cardápio
      </Link>
      <div className="product-page-grid">
        <div className="product-story">
          <img src={p.image} alt={p.name} />
          <div>
            <span className="eyebrow">A BOA PEDIDA DA VEZ</span>
            <h1>
              Um clássico.
              <br />
              Do seu jeito.
            </h1>
            <p>
              Escolha o tamanho, a massa e os adicionais. Cada detalhe importa
              quando o assunto é sua pizza favorita.
            </p>
            <div className="product-promises">
              <span>
                <Leaf />
                Ingredientes selecionados
              </span>
              <span>
                <Flame />
                Preparado na hora
              </span>
              <span>
                <Clock />
                25–35 minutos
              </span>
            </div>
          </div>
        </div>
        <div className="panel product-page-config">
          <ProductConfiguration
            product={p}
            onAdded={() => navigate(appHref("/carrinho"))}
          />
        </div>
      </div>
    </section>
  );
}
