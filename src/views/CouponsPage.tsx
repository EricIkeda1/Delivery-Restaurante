"use client";
import { useState } from "react";
import Link from "@/components/ui/AppLink";
import { Ticket, Copy, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { navigate } from "@/lib/screens";
export function CouponsPage() {
  const { setCoupon, items } = useCart();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText("PIZZA10");
      setCopied(true);
      setMessage("Cupom copiado.");
    } catch {
      setMessage("Use o código PIZZA10 no carrinho.");
    }
  }
  function use() {
    setCoupon("PIZZA10");
    navigate(items.length ? "/carrinho" : "/buscar");
  }
  return (
    <section className="section">
      <span className="eyebrow">UMA BOA PEDIDA FICA AINDA MELHOR</span>
      <h1>Seus cupons</h1>
      <p className="muted">
        Escolha um desconto para seu próximo pedido demonstrativo.
      </p>
      <article className="coupon-offer">
        <div className="coupon-offer-icon">
          <Ticket size={38} />
        </div>
        <div>
          <span className="eyebrow">VÁLIDO NO PEDIDO DEMONSTRATIVO</span>
          <h2>10% de desconto nos itens</h2>
          <p>
            O desconto é aplicado aos produtos. A taxa de entrega permanece a
            mesma.
          </p>
          <div className="coupon-offer-code">
            <b>PIZZA10</b>
            <button
              onClick={() => void copy()}
              aria-label="Copiar código PIZZA10"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}Copiar
            </button>
          </div>
          <button className="btn" onClick={use}>
            Usar cupom
            <ArrowRight size={16} />
          </button>
          {message && (
            <p role="status" className="coupon-message">
              {message}
            </p>
          )}
        </div>
      </article>
      <Link href="/buscar" className="text-link">
        Encontrar meu próximo pedido
        <ArrowRight size={15} />
      </Link>
      <p className="fine-print">
        Projeto fictício. Os cupons simulam descontos e não possuem valor
        monetário.
      </p>
    </section>
  );
}
