"use client";
import { Loading } from "@/components/ui/Feedback";
import Link from "@/components/ui/AppLink";
import { useState } from "react";
import { ShoppingBag, Ticket, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CartLine } from "@/components/cart/CartLine";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { totals } from "@/lib/cart";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
export function CartPage() {
  const { items, coupon, setCoupon, ready } = useCart();
  const [code, setCode] = useState(coupon);
  const [error, setError] = useState("");
  const { data } = useAsync(api.catalog);
  const fee =
    data?.restaurants.find((r) => r.id === items[0]?.product.restaurant_id)
      ?.fee ?? 6;
  const summary = totals(items, fee, coupon);
  if (!ready) return <Loading />;
  return (
    <section className="section narrow">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Continuar explorando
      </Link>
      <div className="section-head">
        <div>
          <span className="eyebrow">TÁ QUASE NA MESA</span>
          <h1>
            Sua sacola <ShoppingBag size={27} />
          </h1>
          <p>Uma boa escolha merece uma última conferida.</p>
        </div>
      </div>
      {items.length ? (
        <div className="checkout-grid">
          <div className="panel">
            {items.map((i) => (
              <CartLine key={i.key} item={i} />
            ))}
            <Link
              className="text-link"
              href={"/loja/" + items[0].product.restaurant_id}
            >
              Adicionar mais delícias
            </Link>
          </div>
          <aside className="panel">
            <h3>Resumo do pedido</h3>
            <div className="coupon">
              <Ticket size={18} />
              <input
                aria-label="Cupom de desconto"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Cupom de desconto"
              />
              <button
                onClick={() => {
                  if (code === "PIZZA10") {
                    setCoupon(code);
                    setError("");
                  } else {
                    setCoupon("");
                    setError("Cupom inválido. Experimente PIZZA10.");
                  }
                }}
              >
                Aplicar
              </button>
            </div>
            {error && <p className="form-error">{error}</p>}
            {coupon && <p className="green">Cupom PIZZA10 aplicado!</p>}
            <OrderSummary {...summary} />
            <Link className="btn full" href="/checkout">
              Ir para o checkout <ArrowRight size={17} />
            </Link>
            <p className="fine-print">
              Pedido demonstrativo. Nenhum valor será cobrado.
            </p>
          </aside>
        </div>
      ) : (
        <div className="empty">
          <ShoppingBag size={44} />
          <h2>Sua sacola está esperando um sabor.</h2>
          <p>Escolha um restaurante e descubra seu próximo favorito.</p>
          <Link className="btn" href="/">
            Explorar restaurantes
          </Link>
        </div>
      )}
    </section>
  );
}
